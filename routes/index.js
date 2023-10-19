var express = require("express");
const indexRouter = require("./index.routes");
const authRouter = require("./auth.routes");
const adminRouter = require("./admin.routes");
const employeeRouter = require("./employee.routes");
const amazonRouter = require("./amazon.routes");
const accountRouter = require("./account.routes");
const db = require("../models");
const {
	Users,
	Orders,
	Powers,
	UserPowers,

} = db;

var app = express();
app.get('/test', async (req, res, next)=>{
    const orders = await Orders.findAll();
    const allSkus = orders.flatMap((order) => order?.sku?.split('|'));
    const allMfr = orders.flatMap((order) => order?.mfrName?.split('|'));
    const allDisti = orders.flatMap((order) => order?.distributor?.split('|'));

    // Group the SKUs and count the number of orders for each SKU
    const skuCounts = {};
    
   
    allSkus.forEach((sku) => {
      if (skuCounts[sku]) {
        skuCounts[sku]++;
      } else {
        skuCounts[sku] = 1;
      }
    });

    // Convert the counts into an array of objects
    const skuCountArray = Object.entries(skuCounts).map(([sku, count]) => ({ sku, count }));

    // Sort the results in descending order based on the number of orders
    skuCountArray.sort((a, b) => b.count - a.count);
    const top10Sku = skuCountArray.slice(0, 10);
    // Print the sorted results
    top10Sku.forEach((skuCount) => {
      console.log(`SKU: ${skuCount.sku}, Number of Orders: ${skuCount.count}`);
    });
    
    
    const mfrCounts = {};
    orders.forEach((order) => {
      const mfrName = order.mfrName;
      if (mfrCounts[mfrName]) {
        mfrCounts[mfrName]++;
      } else {
        mfrCounts[mfrName] = 1;
      }
    });

    // Convert the counts into an array of objects
    const mfrCountArray = Object.entries(mfrCounts).map(([mfrName, count]) => ({
      mfrName,
      count,
    }));

    // Sort the results in descending order based on the number of orders
    mfrCountArray.sort((a, b) => b.count - a.count);
    const top10Manufacturers = mfrCountArray.slice(0, 10);

    // Print the sorted results
    top10Manufacturers.forEach((mfrCount) => {
      console.log(`Manufacturer: ${mfrCount.mfrName}, Number of Orders: ${mfrCount.count}`);
    });
    const distiCounts = {};
    allDisti.forEach((distributor) => {
      if (distiCounts[distributor]) {
        distiCounts[distributor]++;
      } else {
        distiCounts[distributor] = 1;
      }
    });

    // Convert the counts into an array of objects
    const distributorCountArray = Object.entries(distiCounts).map(([distributor, count]) => ({ distributor, count }));

    // Sort the results in descending order based on the number of orders
    distributorCountArray.sort((a, b) => b.count - a.count);
    const top10disti = distributorCountArray.slice(0, 10);

    // Print the sorted results
    top10disti.forEach((distiCount) => {
      console.log(`distributor: ${distiCount.distributor}, Number of Orders: ${distiCount.count}`);
    });
})
app.use("/", indexRouter);
app.use("/auth", authRouter);
app.use("/admin", adminRouter);
app.use("/employee", employeeRouter);
app.use("/amazon",amazonRouter);
app.use("/account",accountRouter);

module.exports = app;
