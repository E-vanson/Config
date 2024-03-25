const { Places } = require('./contact-summary-extras');
const { CommoditySummaryAlgo } = require('./commodity-summary-algo');
const { productDetailsList } = require('./commodity-list');
const CommoditySummaryField = (function () {
  return {
    /**
     * Returns field object
     * @param {*} label
     * @param {*} value
     * @param {*} color
     * @returns
     */
    init: (label, value, color, units) => {
      const htmlGenerator = (value, color, units) => {
        
        return  ` <strong style="color:${color()}">  ${value} ${units} </strong>`;
      };

      return {
        label: label,
        width: 6,
        value: htmlGenerator(value, color, units),
        filter: 'safeHtml',
      };
    }
  };
})();

const CommoditySummaryCard = (reports) => (function () {
  const stockValues = CommoditySummaryAlgo.init(reports).evaluate();
  const fields = Object.keys(stockValues).reduce((acc, key) => {
    const values = stockValues[key].split(' ');
    const stockAtHand = values[0];
    const wos = values[2];
    const isChaArea = contact.contact_type === Places.CHU;
    const isChvArea = contact.contact_type === Places.CHV_AREA;

    if (isChaArea && !productDetailsList[key].showInCard.cha)
    {
      return acc;
    } 

    if (isChvArea && !productDetailsList[key].showInCard.chv){
      return acc;
    }

    const field = CommoditySummaryField.init(
      productDetailsList[key].label,
      stockAtHand,
      () => {
        if (0 <= wos && wos < 2) {
          return 'red';
        }

        if (2 <= wos && wos < 4) {
          return 'orange';
        }

        return 'green';
      },
      productDetailsList[key].units
    );
    acc.push(field);
    return acc;
  }, []);
  
  return {
    label: 'Balance on Hand',
    fields: fields,
    appliesToType: [Places.CHV_AREA, Places.CHU]
  };
})();

module.exports = {
  CommoditySummaryCard,
  CommoditySummaryField
};
