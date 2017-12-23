<?php
//----------------VERSAO .PHP DE REQUESTS A API DA SPTRANS---------------------------------------
$site["sptrans"]["accesspoint"] = "http://api.olhovivo.sptrans.com.br/v2.1";
$site["sptrans"]["page"]["Login"] = "/Login/Autenticar";
$site["sptrans"]["page"]["Parada"] = "/Parada/Buscar";
$site["sptrans"]["page"]["Linha"] = "/Linha/Buscar";
$site["sptrans"]["page"]["PosLinha"] = "/Posicao/Linha";
$site["sptrans"]["page"]["Posicao"] = "/Posicao";


$site["sptrans"]["token"] = "0e2b338cce1cfca206f6b8bfa01f5ded89b18134a6296d4565549c8c14e85b9b"; 

//Metodos de erros, caso haja
error_reporting(E_ALL);
ini_set('display_errors', 1);

function getResult($accesspoint, $page, $postData, $cookie, $post = true) { 
	//Metodo para lidar com o request e ao mesmo tempo com a autenticacao presente no cookie
    
    $ch = curl_init();
    $t = http_build_query($postData);

    $url = $accesspoint.$page."?".$t;

    curl_setopt($ch, CURLOPT_URL, $url);  
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);  
    curl_setopt ($ch, CURLOPT_COOKIEJAR, $cookie);
    curl_setopt ($ch, CURLOPT_COOKIEFILE, $cookie);

    if ($post == true) {
        curl_setopt($ch, CURLOPT_POST, true);  
        curl_setopt($ch, CURLOPT_POSTFIELDS, $postData);  
    }
    curl_setopt($ch, CURLOPT_HEADER, 0);  
    $output = curl_exec($ch);  
    curl_close($ch);     

    return $output;
}

//--------------------------"MAIN"-----------------------------------------------------------------

//Criacao do cookie (temporario)
$ckfile = tempnam ("cache/cookies", "spt.");

//Funcao de autenticacao e chamada
function auth($site, $ckfile){
	$postData["token"] = $site["sptrans"]["token"];
	$output = getResult($site["sptrans"]["accesspoint"], $site["sptrans"]["page"]["Login"], $postData, $ckfile);
	unset($postData);
}

//Funcao para recuperar todos os pontos de onibus em SP
function parada($site, $ckfile){
    auth($site, $ckfile);
    $postData["termosBusca"] = "";
    $output = getResult($site["sptrans"]["accesspoint"], $site["sptrans"]["page"]["Parada"], $postData, $ckfile, false);
    unset($postData);
    return $output;
}



//--------------------REQUEST DO JAVASCRIPT--------------------------------------------------------------------

$q = $_REQUEST["q"];
echo parada($site, $ckfile);


?>