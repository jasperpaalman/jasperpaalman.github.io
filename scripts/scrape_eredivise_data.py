#!/usr/bin/env python
# coding: utf-8

#############
## Imports ##
#############

from itertools import chain

import json

from bs4 import BeautifulSoup
from selenium import webdriver

import numpy as np
import pandas as pd

############
## Scrape ##
############

chrome_options = webdriver.ChromeOptions()
chrome_options.add_argument('--headless')  # don't open window

driver = webdriver.Chrome(chrome_options=chrome_options)  # initiate driver

driver.get("http://www.eredivisiestats.nl/wedstrijden.php")
driver.find_element_by_xpath(
    '/html/body/center/form/table/tbody/tr[2]/td/div[1]/input[1]').click()

html = driver.page_source
soup = BeautifulSoup(html, 'lxml')


def parse_tables(soup):

    table_data = []
    tables = soup.find_all('table')

    for n, table in enumerate(tables):

        table_data.append([])
        headers = list(map(lambda x: x.text, table.findAll('th')))
        table_data[n].append(headers)

        for row in table.findAll("tr"):
            cells = row.findAll("td")

            text = list(map(lambda x: x.text, cells))

            table_data[n].append(text)

    return table_data


table_data = parse_tables(soup)

score_table = list(filter(lambda table: 'Datum' in table[0], table_data))[
    0]  # retrieve score table
score_table = [[cell.strip() for cell in row]
               for row in score_table if len(row) > 0]  # clean score table


# Close driver
driver.close()

#####################
## Preprocess data ##
#####################

####################################
# Basic processing and column adds #
####################################

df = pd.DataFrame(columns=score_table[0], data=score_table[1:])

df = (df
      .assign(Datum=lambda x: pd.to_datetime(x['Datum'], format='%Y-%m-%d'))
      .assign(Thuisscore=lambda x: pd.to_numeric(x['Thuisscore']))
      .assign(Uitscore=lambda x: pd.to_numeric(x['Uitscore'])))

# Combine score
df['Score'] = df.apply(
    lambda x: '{}-{}'.format(x['Thuisscore'], x['Uitscore']), axis=1)

# Add season start and end
df['Seizoen start'], df['Seizoen eind'] = zip(
    *df['Seizoen'].apply(lambda x: map(int, x.split('-'))))

# Get points per match


def calculate_points(dataframe):
    if dataframe['Seizoen start'] >= 1995:
        points_win = 3
    else:
        points_win = 2

    if dataframe['Thuisscore'] > dataframe['Uitscore']:
        return [points_win, 0]
    elif dataframe['Thuisscore'] == dataframe['Uitscore']:
        return [1, 1]
    else:
        return [0, points_win]


points = [calculate_points(row) for index, row in df.iterrows()]

# Points per game
df['Punten thuis'], df['Punten uit'] = zip(*points)

# Uniform point distribution (always 3 points for win)
df['Punten thuis (uniform)'] = df['Punten thuis'].apply(
    lambda x: 3 if x == 2 else x)
df['Punten uit (uniform)'] = df['Punten uit'].apply(
    lambda x: 3 if x == 2 else x)

#############
# Map clubs #
#############

# Create club name mapping based on:
# http://www.eredivisiestats.nl/eeuwigestand.php
# http://www.eredivisiestats.nl/wedstrijden.php

club_mapping = {
    'ADO': 'ADO Den Haag',
    'AZ `67': 'AZ',
    'Alkmaar': 'AZ',
    'BVV': 'BVV Den Bosch',
    'Cambuur Leeuwarden': 'SC Cambuur',
    'DOS': 'FC Utrecht',
    'DS `79': 'FC Dordrecht',
    'Dordrecht `90': 'FC Dordrecht',
    'DWS/A': 'DWS',
    'FC Den Bosch': 'BVV Den Bosch',
    'FC Den Haag': 'ADO Den Haag',
    'FC Twente `65': 'FC Twente',
    'FC VVV': 'VVV-Venlo',
    'FC Zwolle': 'PEC Zwolle',
    'FSC': 'Fortuna Sittard',
    'Feijenoord': 'Feyenoord',
    'Fortuna `54': 'Fortuna Sittard',
    'GVAV': 'FC Groningen',
    'Go Ahead': 'Go Ahead Eagles',
    'Heracles': 'Heracles Almelo',
    'NAC': 'NAC Breda',
    'RKC': 'RKC Waalwijk',
    'Rapid JC': 'Roda JC',
    'SC Enschede': 'FC Twente',
    'SC Heracles': 'Heracles Almelo',
    'Sparta': 'Sparta Rotterdam',
    'VVV': 'VVV-Venlo',
    'Volendam': 'FC Volendam',
    'SHS': 'Holland Sport'
}

######################
# **Perform checks** #
######################

# Check if mapped clubs have played any games against each other

club_games = df[['Thuisclub', 'Uitclub']].apply(sorted, axis=1).values.tolist()
assert not np.any([sorted([key, value]) in club_games for key, value in club_mapping.items(
)]), 'Club mapping invalid: mapped clubs have played games against each other'

# Check for season overlap


def get_active_seasons(club):
    return set(df.loc[(df[['Thuisclub', 'Uitclub']] == club).any(axis=1), 'Seizoen'])


season_overlap = [get_active_seasons(key) & get_active_seasons(
    value) for key, value in club_mapping.items()]
assert np.all(np.array(season_overlap) == set()
              ), 'Club mapping is invalid: seasons overlap'

# Check that all mapped to values appear in data (validated mapping)

all_clubs = set(df['Thuisclub']) | set(df['Uitclub'])

np.all(list(map(lambda x: x in all_clubs, club_mapping.values()))
       ), 'Not all mapped values appear in data'

# Check that all keys appear in data (validated mapping)
np.all(list(map(lambda x: x in all_clubs, club_mapping.keys()))
       ), 'Not all mapped keys appear in data'

# Apply mapping
df['Thuisclub'].replace(club_mapping, inplace=True)
df['Uitclub'].replace(club_mapping, inplace=True)

####################
# Map match rounds #
####################

matches_mapped = pd.Series('', index=range(
    df.shape[0]))  # Save match round info here

for season, season_df in df.groupby('Seizoen'):

    i = 1  # first match round
    cache = set()  # cache to control if clubs have been active in match round

    for index, row in season_df.iterrows():  # iterate over each row
        home = row['Thuisclub']
        away = row['Uitclub']

        if home in cache and away in cache:
            cache.clear()
            i += 1

        cache.add(home)
        cache.add(away)
        matches_mapped.loc[index] = 'M{}'.format(i)  # add match round info

df['Match'] = matches_mapped  # add match column

##################################
## Get visualization JSON files ##
##################################

#########################
# Club analysis mapping #
#########################

# **Form point dataframe**

home_df = df[['Seizoen eind', 'Datum', 'Thuisclub', 'Punten thuis', 'Score', 'Match']]    .rename(
    columns={'Thuisclub': 'Club', 'Punten thuis': 'Points'}).assign(Location='Home')
away_df = df[['Seizoen eind', 'Datum', 'Uitclub', 'Punten uit', 'Score', 'Match']]    .rename(
    columns={'Uitclub': 'Club', 'Punten uit': 'Points'}).assign(Location='Away')

points_df = pd.concat([home_df, away_df], ignore_index=True)
points_df['Against'] = pd.concat(
    [df['Uitclub'], df['Thuisclub']], ignore_index=True)
points_df.sort_values(['Seizoen eind', 'Datum'], inplace=True)

points_df['Seizoen eind'] = points_df['Seizoen eind'].astype(str)
points_df['Points accumulated'] = points_df.groupby(
    ['Seizoen eind', 'Club'])['Points'].cumsum()


# **Add rank and extent information**

min_match_points = points_df.pivot_table(index=['Seizoen eind', 'Match'],
                                         columns='Club', values='Points accumulated', aggfunc='min')
max_match_points = points_df.pivot_table(index=['Seizoen eind', 'Match'],
                                         columns='Club', values='Points accumulated', aggfunc='max')


def sort_season_df(season_df):
    matches = season_df.index
    sorted_matches = sorted(matches, key=lambda x: int(x[1:]))
    return season_df.loc[sorted_matches].fillna(method='ffill')


rank_dict = {}
season_extent = {}

for season in points_df['Seizoen eind'].unique():
    min_season_df = sort_season_df(min_match_points.loc[season])
    max_season_df = sort_season_df(max_match_points.loc[season])

    season_extent[season] = pd.concat([min_season_df, max_season_df], axis=1)                                        .apply(
        lambda s: (s.min(), s.max()), axis=1).to_dict()

    ranked_season_df = max_season_df.rank(
        ascending=False, method='min', axis=1)
    for _, row in ranked_season_df.reset_index().iterrows():
        match = row['Match']
        for club, rank in row[1:].iteritems():
            if rank == rank:
                rank_dict[season, match, club] = rank

points_df['Rank'] = points_df.apply(
    lambda x: rank_dict[(x['Seizoen eind'], x['Match'], x['Club'])], axis=1)

season_point_accumulation = points_df.loc[:, 'Points':].apply(lambda x: dict(x), axis=1)            .groupby(
    points_df[['Seizoen eind', 'Club']].apply(tuple, axis=1)).apply(list).to_dict()

result = {}

for (season, club), point_accumulation in season_point_accumulation.items():
    result.setdefault(season, {})

    result[season][club] = point_accumulation

season_point_accumulation = result

# **Add KPI**


def get_kpi(dataframe):
    result_count = dataframe.groupby('Points')['Points'].count().rename(
        index={0: 'Lost', 1: 'Drawn', 2: 'Won', 3: 'Won'}).to_dict()
    lost, drawn, won = map(lambda x: int(result_count.get(x, 0)), [
                           'Lost', 'Drawn', 'Won'])
    goals_for, goals_against = map(sum, zip(*chain.from_iterable(
        [map(lambda x:
             (int(x[0]), int(x[1])), scores) if location == 'Home'
         else map(lambda x: (int(x[1]), int(x[0])), scores)
         for location, scores in dataframe['Score'].str.split('-').groupby(dataframe['Location'])]
    )))
    goal_difference = goals_for - goals_against
    avg_points_per_match = round(dataframe['Points'].mean(), 2)

    kpi_dict = {'Won': won,
                'Drawn': drawn,
                'Lost': lost,
                'Goals For': goals_for,
                'Goals Against': goals_against,
                'Goal Difference': goal_difference,
                'Points Per Match': avg_points_per_match}

    return kpi_dict


for season, season_df in points_df.groupby(['Seizoen eind']):
    for club, club_df in season_df.groupby('Club'):
        season_point_accumulation[season].setdefault(
            'KPI', {})[club] = get_kpi(club_df)

    season_point_accumulation[season]['KPI']['Overall'] = get_kpi(season_df)
    season_point_accumulation[season]['Extent'] = season_extent[season]

with open('public/static/data/season_point_accumulation.json', 'w') as outfile:
    json.dump(season_point_accumulation, outfile)

######################
# Eredivisie mapping #
######################

# **Form point dataframe**

home_df = (df[['Seizoen eind', 'Datum', 'Thuisclub', 'Punten thuis (uniform)', 'Thuisscore', 'Uitscore']]
           .assign(goal_difference=lambda x: x['Thuisscore'] - x['Uitscore'])
           .rename(columns={'Thuisclub': 'Club', 'Punten thuis (uniform)': 'Season score', 'Thuisscore': 'Goals scored'}))
away_df = (df[['Seizoen eind', 'Datum', 'Uitclub', 'Punten uit (uniform)', 'Thuisscore', 'Uitscore']]
           .assign(goal_difference=lambda x: x['Uitscore'] - x['Thuisscore'])
           .rename(columns={'Uitclub': 'Club', 'Punten uit (uniform)': 'Season score', 'Uitscore': 'Goals scored'}))

points_df = pd.concat([home_df, away_df], ignore_index=True)[['Seizoen eind', 'Datum', 'Club', 'Season score',
                                                              'goal_difference', 'Goals scored']]


season_points = points_df.groupby(['Seizoen eind', 'Club'])[
    'Season score', 'goal_difference', 'Goals scored']            .sum().reset_index()
season_points['Seizoen eind'] = season_points['Seizoen eind'].astype(str)


cumulative_points = season_points.groupby('Club').apply(
    lambda x: x.sort_values('Seizoen eind')['Season score'].cumsum())
cumulative_points.index = cumulative_points.index.droplevel()
season_points['Final score'] = cumulative_points


def get_rank(grouped_df):

    cols = ['Season score', 'goal_difference', 'Goals scored']
    tups = grouped_df[cols].sort_values(cols, ascending=False).apply(tuple, 1)
    f, i = pd.factorize(tups)
    factorized = pd.Series(f + 1, tups.index)

    return factorized


season_points['Season rank'] = pd.concat([get_rank(
    grouped_df) for index, grouped_df in season_points.groupby('Seizoen eind')])


# Check
(season_points.groupby('Seizoen eind')['Season rank'].unique().apply(
    len) == season_points.groupby('Seizoen eind').size()).all(), 'Not ranked correctly'


points_accumulated = season_points[['Club', 'Season rank', 'Season score', 'Final score']].apply(
    lambda x: dict(x), axis=1)            .groupby(season_points['Seizoen eind']).apply(list).to_dict()

# Output

with open('public/static/data/points_accumulated.json', 'w') as outfile:
    json.dump(points_accumulated, outfile)
