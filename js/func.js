//Declaracao de variaveis globais
      var geocoder
      var zoom

      var map;
      var markersParada = [];
      var markersOnibus = []
      var respJson = "";
      var xmlhttp = new XMLHttpRequest();
      var pinColor;
      var pinImage;

      function initMap() { //Funcoes essenciais para inicializacao
        geocoder = new google.maps.Geocoder();

        map = new google.maps.Map(document.getElementById('map'), {
          zoom: 17, //Aproximadamente 1km; se quiser pode colocar uma escala para ficar mais facil de entender (tem na API; nao implementado)
          center: new google.maps.LatLng(-23.481525, -46.500609), //Inicia centralizado na EACH
          mapTypeId: 'terrain'
        });


        if (navigator.geolocation) { //Tenta obter a geolocalizacao do usuario - precisa de porta HTTPS + certificadp
          navigator.geolocation.getCurrentPosition(function(position) {
            pinColor = "cccc00";
            setPinImage(); //Funcao para recurar imagem de pin personalizada
            var pos = { //pos = posicao do usuario
              lat: position.coords.latitude,
              lng: position.coords.longitude
            };

            var marker = new google.maps.Marker({
              position: pos,
              map: map,
              icon: pinImage,
              clickable: true
            }); //Criacao de um marcador para localizar o usuario

            marker.info = new google.maps.InfoWindow({
              content: 'Localização atual encontrada.'
            }); //Conteudo do balao ao clicar no marcador

            google.maps.event.addListener(marker, 'click', function() {
              marker.info.open(map, marker);
            }); //Criacao do evento 'click' para ativar o balao
           
            map.setCenter(pos); //Centraliza a tela na posicao do usuario

          }, function() {
            handleLocationError(true, map.getCenter()); //Funcao para pegar erro - caso nao seja possivel pegar a localizacao
          });
        } else {
          handleLocationError(false, map.getCenter()); //Caso o browser nao suporte geolocalizacao
        }

        function handleLocationError(browserHasGeolocation, pos) { //Funcao que trata o erro
          var infoWindow = new google.maps.InfoWindow({map: map}); //Criacao de um balao com o conteudo do erro
          infoWindow.setPosition(pos);
          infoWindow.setContent(browserHasGeolocation ?
                              'Erro: Falha no serviço de geolocalização.' :
                              'Erro: Seu navegador não suporta o serviço de geolocalização.');
        }
        var latlng = {lat: -23.481525, lng: -46.500609};

        pinColor = "427df4";
        setPinImage();

        var marker = new google.maps.Marker({
          position: latlng,
          map: map,
          icon: pinImage,
          clickable: true
        });

        marker.info = new google.maps.InfoWindow({
          content: 'Local pesquisado.'
        }); //Conteudo do balao ao clicar no marcador

        google.maps.event.addListener(marker, 'click', function() {
          marker.info.open(map, marker);
        }); 

        marker.setVisible(false);

        function carregarNoMapa(endereco) {
        geocoder.geocode({ 'address': endereco + ', Brasil', 'region': 'BR' }, function (results, status) {
          if (status == google.maps.GeocoderStatus.OK) {
            if (results[0]) {
              var latitude = results[0].geometry.location.lat();
              var longitude = results[0].geometry.location.lng();
        
              $('#txtEndereco').val(results[0].formatted_address);
              $('#txtLatitude').val(latitude);
              $('#txtLongitude').val(longitude);

               var location = new google.maps.LatLng(latitude, longitude);
               marker.setPosition(location);
               marker.setVisible(true);
               map.setCenter(location);
               map.setZoom(17);
            }
          }
        })
      }
      
      $("#btnEndereco").click(function() {
        if($(this).val() != "")
          carregarNoMapa($("#txtEndereco").val());
      })
      
      // $("#txtEndereco").blur(function() {
      //   if($(this).val() != "")
      //     carregarNoMapa($(this).val());
      // })
      
      google.maps.event.addListener(marker, 'drag', function () {
        geocoder.geocode({ 'latLng': marker.getPosition() }, function (results, status) {
          if (status == google.maps.GeocoderStatus.OK) {
            if (results[0]) {  
              $('#txtEndereco').val(results[0].formatted_address);
              $('#txtLatitude').val(marker.getPosition().lat());
              $('#txtLongitude').val(marker.getPosition().lng());
            }
          }
        });
      });
      
      $("#txtEndereco").autocomplete({
        source: function (request, response) {
          geocoder.geocode({ 'address': request.term + ', Brasil', 'region': 'BR' }, function (results, status) {
            response($.map(results, function (item) {
              return {
                label: item.formatted_address,
                value: item.formatted_address,
                latitude: item.geometry.location.lat(),
                longitude: item.geometry.location.lng()
              }
            }));
          })
        },
        // select: function (event, ui) {
        //   $("#txtLatitude").val(ui.item.latitude);
        //     $("#txtLongitude").val(ui.item.longitude);
        //   var location = new google.maps.LatLng(ui.item.latitude, ui.item.longitude);
        //   marker.setPosition(location);
        //   map.setCenter(location);
        //   map.setZoom(16);
        // }
      });
      
      $("form").submit(function(event) {
        event.preventDefault();
        carregarNoMapa($("#txtEndereco").val());        
      });

      }


      //acabou o initMap()



      function setPinImage(){ //Funcao boba para dar request numa API do Google, retornando um .png personalizado para o marcador
        pinImage = new google.maps.MarkerImage("https://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2|" + pinColor, 
          //pinColor e um valor HTML hexadecimal de cor
          new google.maps.Size(21, 34),
          new google.maps.Point(0,0),
          new google.maps.Point(10, 34));
      }

      function addMarker(location, letreiro, destino, origem, prefixo) { //Funcao de plot de um unico ponto, tendo ja todas as infos necessarias
        var marker = new google.maps.Marker({
          position: location,
          map: map,
          title : letreiro,
          icon: pinImage,
          clickable: true //Ao clicar abre balao com infos
        });
        marker.info = new google.maps.InfoWindow({
          content: "Letreiro: " + letreiro + "<br>" + "Destino: " + destino + "<br>" + "Origem: " + origem + "<br>" + "Prefixo: " + prefixo
        });
        google.maps.event.addListener(marker, 'click', function() {
          marker.info.open(map, marker);
        });
        markersOnibus.push(marker); //utiliza-se um array de todos os marcadores para controle - utilizado depois para deletar todos os pontos
      }
    
    function addParad(location, parada, endereco, codP) { //Funcao de plot de um unico ponto, tendo ja todas as infos necessarias
        var marker = new google.maps.Marker({
          position: location,
          map: map,
          title : parada,
          icon: pinImage,
          clickable: true //Ao clicar abre balao com infos
        });
        marker.info = new google.maps.InfoWindow({
          content: "Parada: " + parada + "<br>" + "Endereco: " + endereco + "<br>" + "Código: " + codP 
        });
        google.maps.event.addListener(marker, 'click', function() {
          marker.info.open(map, marker);
        });
        markersParada.push(marker); //utiliza-se um array de todos os marcadores para controle - utilizado depois para deletar todos os pontos
      }

      function deleteMarkers(markers) { //Funcao principal que deleta todos os marcadores plottados
        clearMarkers(markers);
        markers = [];
      }

      function clearMarkers(markers) {
        setMapOnAll(null, markers); //Null e levado ao proximo metodo para indicar que deve-se tirar os marcadores
      }

      function setMapOnAll(map, markers) { //Deleta um por um os marcadores - invalida um a um os pontos
        for (var i = 0; i < markers.length; i++) {
          markers[i].setMap(map);
        }
      }

      function mbounds(map, location) { //Metodo simples para verificar se um ponto esta contido no frame do Google Maps
        if(map.getBounds().contains(location)){
          return true;
        }
        else {
          return false;
        }
      }

      function getBus() { //Funcao que trata das requisicoes com outro arquivo .php

        xmlhttp.open("GET", "getbus.php?q=posicao", true); 
        //O segundo argumento e dado como nome do arquivo (pois esta na mesma pasta) + ? + parametros. 
        //Passamos q = posicao, pois estamos declarando a variavel q com o conteudo posicao para indicar que metodo chamar no .php
        xmlhttp.send();

        xmlhttp.onreadystatechange = function() { 
        //Metodo assincrono (depois de chamado, acontece de forma nao linear; e chamado em qualquer momento que houver mudanca na rede)
        //Serve para ativar funcoes quando a resposta do .php estiver pronta
          if (xmlhttp.readyState == 4 && xmlhttp.status == 200) { //Caso o .php tenha terminado de executar e tenha ocorrido sem problemas
            respJson = this.responseText; //Guarda-se a resposta em respJson e manda para o plot
            filter_plotter(respJson);
          } else {
            //console.log("Nao foi");
          }
        }
      }
    
    
    //--------------------------------------------------------------------------------------------------------------
    function getStop() { //Chama tambem outro arquivo .php
    
    xmlhttp.open("GET", "getstop.php?q=AFONSO", true);
    //Assim como na funcao getBus, o segundo argumento e o nome do arquivo e q usado para indicar metodo e evitar erros
    xmlhttp.send();
    
    xmlhttp.onreadystatechange = function() { 
          if (xmlhttp.readyState == 4 && xmlhttp.status == 200) { //Caso o .php tenha terminado de executar e tenha ocorrido sem problemas
            respJ = this.responseText; //Guarda-se a resposta em respJ e manda para o bd
            armazBD(respJ);
          } else {
            //console.log("Nao foi");
          }
        }
      
    }
    
    function armazBD(rJson){ 
        parada = JSON.parse(rJson); //Importante converter a resposta (String) em objeto Json
    for(var i in parada){ 
      var codPar = parada[i].cp;
      var nomePar = parada[i].np;
          var endereco = parada[i].ed;
          var latPar = parada[i].py;
      var lonPar = parada[i].px;
      
      
      stopPlot(parada[i], nomePar, endereco);
        }
    }
    
    function stopPlot(rJson, nomePar, endereco) {
    p = rJson;
    //console.log(p.py);
    var local = new google.maps.LatLng(p.py, p.px);
    
    if(mbounds(map, local)){
      cod = (p.cp).toString(); 
      addParad(local, nomePar, endereco, cod);  
    }
      
    }
    
  /*  
    function conBD() {//Funcao para conexao com BD
      var con = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "root",
        database: "sptrans"
      });
      return con;  
    }
    
    function insertStop(cod, nome, end, lat, lon) {//Popular o BD com os pontos
      if (err) throw err;
      console.log("Connected!");
      var sql = "INSERT INTO stops VALUES (cod, nome, end, lat, lon)";
      //insert = sprintf("INSERT INTO stops VALUES (cod, nome, end, lat, lon)");
      //dados = mysql_query($insert, $con) or die(mysql_error());
      con.query(sql,
      
    }
    
    
    function filterStops () {
      
      
    }
    */
    //-------------------------------------------------------------------------------------------------------------------

    
      function posicao(checkboxElem) { //Funcao chamada pelo botao
        if(checkboxElem.checked){
          pinColor = "ff3300"; //Troca-se a cor para diferenciar do marcador do usuario
          setPinImage(); //Faz o request para haver retorno do novo marcador
          getBus(); //Chamada de requisicao ao .php
        } else {
          deleteMarkers(markersOnibus); //Destroi os pontos antigos, caso haja
        }
      }
    
    function stopGeral(checkboxElem) {
      if(checkboxElem.checked){
        pinColor = "66ff33";
        setPinImage();
        getStop();
      } else {
          deleteMarkers(markersParada); //Destroi os pontos antigos, caso haja
        }
    }

      function filter_plotter(rJson){ 
        //A resposta da API ainda precisa ser filtrada - vem organizado por linhas e ainda e preciso ver quais possuem onibus a serem plottados
        linha = (JSON.parse(rJson)).l; //Importante converter a resposta (String) em objeto Json
        for(var i in linha){ //Para cada linha de onibus...
          if(linha[i].hasOwnProperty("vs")){ 
            //Para saber se ha algum onibus em movimento na linha, e preciso verificar se ha o subconjunto "vs", caso nao haja e porque nao ha onibus
            var letreiro = linha[i].c;
            var destino = linha[i].lt0;
            var origem = linha[i].lt1;
            plotter(linha[i], letreiro, destino, origem); 
          }
        }
      }

      function plotter(rJson, letreiro, destino, origem) { //Recebe uma linha com array de onibus plottavel
        buses = rJson.vs; //Filtro

          for(var i in buses) { //Para cada onibus...
            var bus = buses[i]; 
            var location = new google.maps.LatLng(bus.py, bus.px); //bus.py e bus.px sao as coordenadas; e preciso converter em objeto LatLng antes de plottar
            if(mbounds(map, location)){ //Se o onibus em questao estiver dentro do frame do mapa...
              prefixo = (bus.p).toString(); //Prefixo e praticamente um indentificador unico para cada onibus
              addMarker(location, letreiro, destino, origem, prefixo); //Adiciona finalmente aquele onibus individualmente
            }
          }
      }

