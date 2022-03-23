define(['dojo/_base/declare', 'jimu/BaseWidget', 'dojo/dom', "dojo/_base/lang", "esri/tasks/QueryTask", "esri/tasks/query", "esri/SpatialReference", "esri/graphic","esri/symbols/SimpleFillSymbol"],
  function (declare, BaseWidget, dom, lang, QueryTask, Query, SpatialReference, Graphic, SimpleFillSymbol) {
    //To create a widget, you need to derive from BaseWidget.
    return declare([BaseWidget], {
      // Custom widget code goes here

      baseClass: 'jimu-widget-BuscaParroquia',

      //this property is set by the framework when widget is loaded.
      //name: 'CustomWidget',


      //methods to communication with app container:

      // postCreate: function() {
      //   this.inherited(arguments);
      //   console.log('postCreate');
      // },

      // startup: function() {
      //  this.inherited(arguments);
      //  this.mapIdNode.innerHTML = 'map id:' + this.map.id;
      //  console.log('startup');
      // },

      onOpen: function () {
        console.log('onOpen');
      },

      cargaConcellos() {
        //Recogida del codigo de la provincia
        let codigoProvincia = this.selectProvincia.value;
        if (codigoProvincia == -1) return;//si es -1, para la función

        this.listaConcellos.innerHTML = "";//Con esto se limpia el código


        //QUERYTASK

        const queryTask = new QueryTask(this.config.concellos);

        const query = new Query();
        query.returnGeometry = false;
        query.outFields = ["CODCONC", "CONCELLO"];
        query.orderByFields = ["CONCELLO"];
        query.where="CODPROV="+ codigoProvincia;


        queryTask.execute(query, lang.hitch(this, function (results) {
          opt = document.createElement("option");
          opt.value = '-1';
          opt.innerHTML = "Selecciona un concello";
          this.listaConcellos.add(opt);
          for (var i = 0; i < results.features.length; i++) {
            opt = document.createElement("option");
            opt.value = results.features[i].attributes.CODCONC;
            opt.innerHTML = results.features[i].attributes.CONCELLO;
            this.listaConcellos.add(opt);
          }
          console.log('results',results)
        }));        

        
      },

      cargaParroquias(){
        let codigoParroquia = this.listaConcellos.value;
        if (codigoParroquia == -1) return;

        this.listaParroquias.innerHTML = "";


        const queryTaskParro = new QueryTask(this.config.parroquias);

        const queryParro = new Query();
        queryParro.returnGeometry = false;
        queryParro.outFields = ["CODPARRO", "PARROQUIA"];
        queryParro.orderByFields = ["PARROQUIA"];
        queryParro.where="CODCONC="+ codigoParroquia;


        queryTaskParro.execute(queryParro, lang.hitch(this, function (results) {
          opt = document.createElement("option");
          opt.value = '-1';
          opt.innerHTML = "Selecciona una Parroquia";
          this.listaParroquias.add(opt);
          for (var i = 0; i < results.features.length; i++) {
            opt = document.createElement("option");
            opt.value = results.features[i].attributes.CODPARRO;
            opt.innerHTML = results.features[i].attributes.PARROQUIA;
            this.listaParroquias.add(opt);
          }
          
        }));        
      },
      zoomConcello() { 
        var codigoConcello = this.listaConcellos.value;
        if (codigoConcello === -1) return;
  
        var queryTask = new QueryTask(this.config.concellos);
        var query = new Query();
        query.returnGeometry = true;
        query.outFields = ["CODCONC", "CONCELLO"];
        query.orderByFields = ["CONCELLO"];
        query.where = "CODCONC = " + codigoConcello;
        query.outSpatialReference = new SpatialReference(102100);
  
        queryTask.execute(query, lang.hitch(this, function (results) {
          if (results.features.length > 0) {
            var geometriaConcello = results.features[0].geometry;
            this.map.graphics.clear();
            this.map.graphics.add(new Graphic(geometriaConcello, new SimpleFillSymbol()));
            this.map.setExtent(geom.getExtent(), true);
          }
        }));
      },

      zoomParroquia() { 
        let codigoParroquia = this.listaConcellos.value;
        if (codigoParroquia == -1) return;

        this.listaParroquias.innerHTML = "";
  
        var queryTask = new QueryTask(this.config.parroquias);
        var query = new Query();
        query.returnGeometry = true;
        query.outFields = ["CODPARRO", "PARROQUIA"];
        query.orderByFields = ["PARROQUIA"];
        query.where = "CODCONC = " + codigoParroquia;
        query.outSpatialReference = new SpatialReference(102100);
  
        queryTask.execute(query, lang.hitch(this, function (results) {
          if (results.features.length > 0) {
            var geometriaParroquia = results.features[0].geometry;
            this.map.graphics.clear();
            this.map.graphics.add(new Graphic(geometriaParroquia, new SimpleFillSymbol()));
            this.map.setExtent(geometriaParroquia.getExtent(), true);
          }
        }));
      },


      onClose: function () {
        console.log('onClose');
      },

      // onMinimize: function(){
      //   console.log('onMinimize');
      // },

      // onMaximize: function(){
      //   console.log('onMaximize');
      // },

      // onSignIn: function(credential){
      //   /* jshint unused:false*/
      //   console.log('onSignIn');
      // },

      // onSignOut: function(){
      //   console.log('onSignOut');
      // }

      // onPositionChange: function(){
      //   console.log('onPositionChange');
      // },

      // resize: function(){
      //   console.log('resize');
      // }

      //methods to communication between widgets:

    });
  });