/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

var db;
var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        db = window.openDatabase("Database", "1.0", "Reorder", 5242880);

        $("#btnAddItem").on('click',function(e){
            startScan();
            var data = {Item:"Colgate", ItemProductGroup:"Toothpaste", ItemProductManufacturer: "Colgate Inc", ItemId: 11223498573};
            data = JSON.stringify(data);
            db.transaction(function (tx) {
                tx.executeSql('CREATE TABLE IF NOT EXISTS person(id unique, data )');
                tx.executeSql('INSERT OR REPLACE INTO person(id, data) VALUES (1, ?)', [data]);
                tx.executeSql('INSERT OR REPLACE INTO person(id, data) VALUES (2, ?)', [data]);
                tx.executeSql('INSERT OR REPLACE INTO person(id, data) VALUES (3, ?)', [data]);
                tx.executeSql('INSERT OR REPLACE INTO person(id, data) VALUES (4, ?)', [data]);

            });



        });

        $("#btnViewItem").on("click", function(e){
            $('#ulItemList').html('');
            db.transaction(function(tx){
                tx.executeSql('SELECT * FROM person',[], function(tx,results){queryGetPersonInfoSuccess(tx,results)}, errorCB);
            });
            window.location.hash = '#itemList';
        });

        $("#btnViewTransaction").on('click',function(e){
            $('#ulTransactionList').html('');
            window.location.hash = "transactionList";
        });

        app.receivedEvent('deviceready');
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
    }
};

app.initialize();



// Transaction error callback
//

function queryGetPersonInfoSuccess(tx,results){
    var len = results.rows.length;
    var result = '';
    alert(len);
    var obj;
    for(var i = 0; i<len; i++){
        obj = JSON.parse(results.rows.item(i).data);
        alert(obj.ItemProductGroup);
        result += '<li class="ui-first-child"><a href="#viewIndividualItem" class="ui-btn ui-btn-icon-right ui-icon-carat-r" data-transition="slide"' + 'data-itemName="' + obj.Item +
        '" data-itemProductGroup="' +obj.ItemProductGroup +
        '" data-itemProductManufacturer="' +obj.ItemProductManufacturer +
        '" data-itemId="' + obj.ItemId  +'"' + '" style="font-style:oblique;color:lightslategray" class="ui-btn ui-btn-icon-right ui-icon-carat-r itemclickhere"' + '>' + obj.Item +'</a></li>'
    }
    $('#ulItemList').html(result);

    $('#ulItemList').find("a").click(function(e){
        console.log(JSON.stringify($(this).attr('data-itemName')));
        $('#itemTitleFromResponse').html($(this).attr('data-itemName'));
        $('#itemProductGroupFromResponse').html($(this).attr('data-itemProductGroup'));
        $('#itemManufacturerFromResponse').html($(this).attr('data-itemProductManufacturer'));
        $('#itemIdFromResponse').html($(this).attr('data-itemId'));
    });

}

function errorCB(err) {
    console.log("DW: Error processing SQL: "+ JSON.stringify(err));
}

function startScan() {
    cordova.plugins.barcodeScanner.scan(
        function (result) {
            var s = "Result: " + result.text +
                "Format: " + result.format +
                "Cancelled: " + result.cancelled;
            alert(JSON.stringify(s));
            //resultDiv.innerHTML = s;
        },
        function (error) {
            alert("Scanning failed: " + error);
        }
    );
}


function successCB() {
    alert("success!");
}
