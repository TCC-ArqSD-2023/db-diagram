/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 100.0, "KoPercent": 0.0};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.5811363636363637, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.28, 500, 1500, "POST prestador"], "isController": false}, {"data": [0.6745, 500, 1500, "GET exame"], "isController": false}, {"data": [0.67, 500, 1500, "POST exame"], "isController": false}, {"data": [0.305, 500, 1500, "POST associado"], "isController": false}, {"data": [0.565, 500, 1500, "POST tipoExame"], "isController": false}, {"data": [0.6985, 500, 1500, "GET consulta"], "isController": false}, {"data": [0.4285, 500, 1500, "GET prestador"], "isController": false}, {"data": [0.285, 500, 1500, "POST conveniado"], "isController": false}, {"data": [0.554, 500, 1500, "GET conveniado"], "isController": false}, {"data": [0.55, 500, 1500, "POST consulta"], "isController": false}, {"data": [0.305, 500, 1500, "POST especialidade"], "isController": false}, {"data": [0.486, 500, 1500, "GET associado"], "isController": false}, {"data": [0.365, 500, 1500, "POST plano"], "isController": false}, {"data": [0.589, 500, 1500, "GET plano"], "isController": false}, {"data": [0.578, 500, 1500, "GET especialidade"], "isController": false}, {"data": [0.773, 500, 1500, "GET tipoExame"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 8800, 0, 0.0, 932.4553409090889, 161, 3610, 870.0, 1644.0, 2087.949999999999, 3189.99, 117.69426240470777, 2026.551293759195, 20.653180169185504], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["POST prestador", 100, 0, 0.0, 2078.6, 198, 3610, 2562.0, 3378.9, 3510.1, 3609.2499999999995, 5.605381165919282, 6.04877557455157, 3.421253153026906], "isController": false}, {"data": ["GET exame", 1000, 0, 0.0, 735.2419999999998, 165, 2106, 576.0, 1518.1999999999998, 1679.9499999999998, 1905.99, 15.50195324610901, 365.0548763089462, 2.2253780538847896], "isController": false}, {"data": ["POST exame", 100, 0, 0.0, 669.4100000000001, 180, 2343, 662.5, 1285.0, 1343.0, 2342.93, 7.119464616260857, 6.3755361846789125, 2.6072258116189664], "isController": false}, {"data": ["POST associado", 100, 0, 0.0, 1522.2800000000004, 183, 3151, 1818.5, 2078.8, 2086.0, 3143.189999999996, 6.211951795254069, 7.825603335818115, 5.32626335569636], "isController": false}, {"data": ["POST tipoExame", 100, 0, 0.0, 904.9799999999999, 171, 2729, 677.5, 1371.0, 1568.6999999999998, 2717.7599999999943, 6.739452756436178, 4.949285618007818, 1.829656119423103], "isController": false}, {"data": ["GET consulta", 1000, 0, 0.0, 752.6719999999997, 162, 3110, 479.5, 1540.0, 3014.8999999999414, 3086.99, 15.652636686649867, 244.87866821986475, 2.2928667021459765], "isController": false}, {"data": ["GET prestador", 1000, 0, 0.0, 1187.330999999999, 201, 3238, 1120.0, 2105.8, 2334.85, 2413.99, 14.211206957806926, 525.4889654418974, 2.0955979010047323], "isController": false}, {"data": ["POST conveniado", 100, 0, 0.0, 1297.5599999999997, 202, 2091, 1540.0, 2044.0, 2053.0, 2090.77, 6.037189084762135, 5.500681070393624, 2.7709754588263706], "isController": false}, {"data": ["GET conveniado", 1000, 0, 0.0, 876.8539999999988, 161, 3119, 822.0, 1817.0, 2072.0, 2082.0, 14.701990649533947, 123.28728987639302, 2.1823267370401953], "isController": false}, {"data": ["POST consulta", 100, 0, 0.0, 1218.9299999999992, 169, 3331, 1285.0, 3040.1, 3190.95, 3330.92, 6.4053292339226235, 5.535855832052268, 2.339446419420958], "isController": false}, {"data": ["POST especialidade", 100, 0, 0.0, 1302.28, 185, 2215, 1512.5, 1976.7, 2166.0, 2214.97, 5.989099838294304, 4.404093924058214, 1.6376444870335989], "isController": false}, {"data": ["GET associado", 1000, 0, 0.0, 1067.2429999999995, 174, 2421, 1035.5, 1636.0, 2093.8999999999996, 2351.0, 15.065686392672049, 621.7948046451277, 2.2216002395444137], "isController": false}, {"data": ["POST plano", 100, 0, 0.0, 1365.1200000000003, 166, 2209, 1254.0, 2169.8, 2204.95, 2208.99, 6.409845522722902, 5.758845586821358, 3.0859900807640535], "isController": false}, {"data": ["GET plano", 1000, 0, 0.0, 926.5420000000006, 165, 2108, 994.0, 1464.0, 1498.0, 2084.0, 14.440016172818114, 267.91430662652346, 2.0729320091838503], "isController": false}, {"data": ["GET especialidade", 1000, 0, 0.0, 1004.2150000000006, 161, 3554, 805.0, 2792.4999999999764, 3215.7, 3520.8900000000003, 13.626762962458269, 42.38383716869932, 2.062644784356476], "isController": false}, {"data": ["GET tipoExame", 1000, 0, 0.0, 619.5920000000008, 161, 3321, 429.0, 1281.0, 1373.0, 2941.99, 15.764665079690383, 51.942924153240426, 2.324672292024656], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": []}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 8800, 0, "", "", "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
