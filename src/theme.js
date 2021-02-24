export const lightBlue = 'rgb(39, 138, 255)';
export const blue = 'rgb(0, 95, 174)';

export const getShadow = (height, fromTop = false) => `${fromTop ? 0 : height * 0.7}pt ${height}pt ${height * 4}pt rgba(0,0,0,.25)`;

export const getColoredShadow = (height, rgb: any, fromTop = false) => {
    const { r, g, b } = rgb;
    return `${fromTop ? 0 : height * 0.7}pt ${height}pt ${
        height * 4
    }pt rgba(${r},${g},${b}, .5)`;
};

export const headerFont = 'roboto, sans-serif';

export const contentFont = 'roboto, sans-serif';

export const sectionHeaderStyle = {
    textAlign: 'center',
    fontSize: '48pt',
    lineHeight: '48pt',
    padding: '32pt 0',
    fontFamily: headerFont,
    fontWeight: '500',
};
