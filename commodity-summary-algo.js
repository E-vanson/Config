const { productList, productDetailsList } = require('./commodity-list');
const { Services, DateTime } = require('./common-extras');
const extras = require('./nools-extras');
const Utils = require('cht-nootils')();
const CommoditySummaryAlgo = (function () {
  /**
   * Calculates the stock at hand given the initial stock values and the stock forms.
   * @param {object} stockTally - a hashmap of the commodity item with the initial stock count values.
   * @param {Array} recentCommodityReports - an array of reports around commodity management.
   * @returns a hashmap of the stock at hand values.
   */
  const stockAlteringForms = [
    // CHV forms
    Services.COMMODITES_RECEIVED,
    Services.COMMODITES_RETURNED,
    Services.CHV_CONSUMPTION_LOG,
    Services.COMMODITES_DISCREPANCY_RESOLUTION,
    Services.COMMODITY_RECEIVED_CONFRIMATION,
    Services.COMMODITIES_DISCREPANCY_RECONCILIATION,
    // CHA forms
    Services.COMMODITES_ORDER
  ];
  const calculateStockAtHand = (stockTally, recentCommodityReports) => {
    recentCommodityReports.forEach((report) => {
      productList.forEach((currentItem) => {
        // Get group name
        const groupName = getProductGroup(currentItem);
        /* CHV forms */
        //adds to stock
        if (report.form === Services.COMMODITY_RECEIVED_CONFRIMATION) {
          const fieldName = `${currentItem}_supplied`;
          const fieldValue = getFieldValue(report, fieldName);
          stockTally[currentItem] = stockTally[currentItem] + fieldValue;
        }
        if (report.form === Services.COMMODITES_DISCREPANCY_RESOLUTION) {
          const fieldName = `${currentItem}_ammendment`;
          const fieldValue = getFieldValue(report, fieldName);
          stockTally[currentItem] = stockTally[currentItem] + fieldValue;
        }
        // subtracts from stock
        if (report.form === Services.COMMODITES_RETURNED) {
          const fieldName = getFieldValue(report,`${groupName}.${currentItem}_received`,false) === 'yes' ? `returned_${currentItem}` :`${groupName}.${currentItem}_quantity_received`;
          const fieldValue = getFieldValue(report, fieldName);
          stockTally[currentItem] = stockTally[currentItem] - fieldValue;
        }

        if (report.form === Services.CHV_CONSUMPTION_LOG) {
          const fieldName = `${currentItem}_quantity_issued`;
          const fieldValue = getFieldValue(report, fieldName);
          stockTally[currentItem] = stockTally[currentItem] - fieldValue;
        }

        // CHA forms
        // Adds to stock
        if (report.form === Services.COMMODITES_ORDER) {
          const fieldName = `${groupName}.${currentItem}_received`;
          const fieldValue = getFieldValue(report, fieldName);
          stockTally[currentItem] = stockTally[currentItem] + fieldValue;
        }
        if (report.form === Services.COMMODITY_RETURNED_CONFIRMATION) {
          const fieldName = `${currentItem}_returned`;
          const fieldValue = getFieldValue(report, fieldName);
          stockTally[currentItem] = stockTally[currentItem] + fieldValue;
        }
        if (report.form === Services.COMMODITIES_DISCREPANCY_RECONCILIATION) {
          const fieldName = `${currentItem}_reconciliation`;
          const fieldValue = getFieldValue(report, fieldName);
          stockTally[currentItem] = stockTally[currentItem] + fieldValue;
        }
        // Subtracts stock
        if (report.form === Services.COMMODITES_RECEIVED) {
          const fieldName = getFieldValue(report,`${groupName}.${currentItem}_received`,false) === 'yes' ? `rs_${currentItem}` :`${groupName}.${currentItem}_quantity_received`;
          const fieldValue = getFieldValue(report, fieldName);
          stockTally[currentItem] = stockTally[currentItem] - fieldValue;
        }
        
      });
    });

    return stockTally;
  };

  /**
   * calculate the weekly average stock consumption for each product item.
   * @param {Array} stockConsumption- an array of chv_consumption_log reports for the last 3wks.
   * @returns - A hashmap of commodity names with the average weekly consumption.
   */
  const calculateAverageWeeklyConsumption = (stockConsumption) => {
    const averageWeeklyConsumptionValues = productList.reduce((acc, c) => {acc[c] = 0; return acc;}, {});
    stockConsumption.forEach((report) => {
      productList.forEach((product) => {
        const currentValue = averageWeeklyConsumptionValues[product];
        const fieldValue = getFieldValue(report, product) / 3;
        averageWeeklyConsumptionValues[product] = currentValue + fieldValue;              
      });
    });

    return averageWeeklyConsumptionValues;
  };

  /**
   * Gets the numeric value for a fieldName from the given report.
   * @param {object} report - The report object.
   * @param {string} fieldName - The field name.
   * @returns The numeric value for fieldName. If value is not numeric, returns 0.
   */
  const getFieldValue = (report, fieldName, intOnly =true)=> {
    const fieldValue = Utils.getField(report, fieldName);
    const value = parseFloat(fieldValue);
    if(intOnly)
    {
      if (!Number.isNaN(value) && fieldValue !== undefined) {
        return value;
      }
      return 0;
    }
    return fieldValue;
  };

  /**
   * Get the group which a commodity is defined under in the workflow.
   * @param {string} productName - The commodity name.
   * @returns The group which commodity is defined under in the workflow.
   */
  const getProductGroup = (productName) => {
    const productDetail = productDetailsList[productName];
    const productSection = productDetail && productDetail.section || null;
    return productSection ? `s_${productSection}` : 's_';
  };

  return {
    latestCommodityCountReport: null,
    recentCommodityReports: null,
    stockConsumption: [],
    init: (reports) => {
      // Get latest commodity count form
      CommoditySummaryAlgo.latestCommodityCountReport = Utils.getMostRecentReport(reports, Services.COMMODITES_COUNT);

      // Get recent commodity reports after latestCommodityCountReport.reported_date
      let startDatetime = CommoditySummaryAlgo.latestCommodityCountReport && CommoditySummaryAlgo.latestCommodityCountReport.reported_date;
      
      // if startDatetime is not defined, set to an early date. 
      if(!startDatetime) { 
        startDatetime = new Date('1970-01-01Z00:00:00:000'); 
      }
      // Get stock reports from contact.
      CommoditySummaryAlgo.recentCommodityReports = extras.getReportsSubmittedInWindow(
        reports,
        stockAlteringForms,
        startDatetime,
        DateTime.now().toJSDate());

      // Get CHV consumption logs for the last three wks.
      CommoditySummaryAlgo.stockConsumption= extras.getReportsSubmittedInWindow(
        reports, [Services.CHV_CONSUMPTION_LOG], DateTime.now().minus({weeks: 3}).toJSDate(), DateTime.now().toJSDate());

      return CommoditySummaryAlgo;
    },
    evaluate: () => {
      // if a stock count form exists, get the initial values from that.
      // if not exists, set the initial values to 0 foreach commodity item.
      const initialStockValues = productList.reduce((acc, currentItem) => {
        const fieldName = `${currentItem}_count_final`;
        const fieldValue = CommoditySummaryAlgo.latestCommodityCountReport ? getFieldValue(CommoditySummaryAlgo.latestCommodityCountReport, fieldName) : 0;
        acc[currentItem] = fieldValue;
        return acc;
      }, {});
      
      const finalStockAtHand = calculateStockAtHand(initialStockValues, CommoditySummaryAlgo.recentCommodityReports);
      const averageWeeklyConsumptionValues = calculateAverageWeeklyConsumption(CommoditySummaryAlgo.stockConsumption);
      const combined = productList.reduce((accumulator, commodity) => {
        const stockAtHand = finalStockAtHand[commodity];
        const averageWeeklyConsumption = Math.round(averageWeeklyConsumptionValues[commodity] * 10) / 10; 
        const weeksOfStock = Math.round((averageWeeklyConsumption !== 0 ? stockAtHand / averageWeeklyConsumption : stockAtHand) * 10) / 10;
        accumulator[commodity] = `${stockAtHand} ${averageWeeklyConsumption} ${weeksOfStock}`;
        return accumulator;
      }, {});
      return combined;
    }
  };
})();

module.exports = { CommoditySummaryAlgo};
