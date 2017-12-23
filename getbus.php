<?php
//----------------VERSAO .PHP DE REQUESTS A API DA SPTRANS---------------------------------------
$site["sptrans"]["accesspoint"] = "http://api.olhovivo.sptrans.com.br/v2.1";
$site["sptrans"]["page"]["Login"] = "/Login/Autenticar";
$site["sptrans"]["page"]["Parada"] = "/Parada/Buscar?termosBusca={termosBusca}";
$site["sptrans"]["page"]["Linha"] = "/Linha/Buscar";
$site["sptrans"]["page"]["PosLinha"] = "/Posicao/Linha";  //Posicao/Linha?codigoLinha={codigoLinha}
$site["sptrans"]["page"]["Posicao"] = "/Posicao";

$site["sptrans"]["token"] = "0e2b338cce1cfca206f6b8bfa01f5ded89b18134a6296d4565549c8c14e85b9b"; 


//Metodos de erros, caso haja
error_reporting(E_ALL);
ini_set('display_errors', 1); 


//Funcao para transformar a resposta da API em array - acabou nao sendo implementada
function object_to_array($data) {
    if (is_array($data) || is_object($data)) {
        $result = array();
        foreach ($data as $key => $value)
            $result[$key] = object_to_array($value);
        return $result;
    }
    return $data;
}

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


//Metodos nao usados para outros tipos de busca na API
/*
print "<hr />";

print "Linha<br />";
$postData["termosBusca"] = "8000";
$output = getResult($site["sptrans"]["accesspoint"], $site["sptrans"]["page"]["Linha"], $postData, $ckfile, false);
print_r ($output);
unset($postData);

print "<hr />";

print "Parada<br />";
$postData["termosBusca"] = "Afonso";
$output = getResult($site["sptrans"]["accesspoint"], $site["sptrans"]["page"]["Parada"], $postData, $ckfile, false);
print_r ($output);
unset($postData);

print "<hr />";
*/


//Funcao teste para recuperar os onibus em movimento por linha - Nao usado (apenas implementado para teste)
function pos_linha($site, $ckfile){
        auth($site, $ckfile);
        $postData["codigoLinha"] = "338";
        $output = getResult($site["sptrans"]["accesspoint"], $site["sptrans"]["page"]["PosLinha"], $postData, $ckfile, false);
        unset($postData);
        return $output;
}


//Funcao para recuperar todos os onibus em movimento em SP (aprox. 15000)
function posicao($site, $ckfile){
    auth($site, $ckfile);
    $postData[""] = "";
    $output = getResult($site["sptrans"]["accesspoint"], $site["sptrans"]["page"]["Posicao"], $postData, $ckfile, false);
    unset($postData);
    return $output;
}


//Metodo de deletar o cookie - Nao implementado - Melhor deixar ele em paz
//unlink($ckfile);

//--------------------REQUEST DO JAVASCRIPT--------------------------------------------------------------------


//Define a variavel q com o que foi passado no request
$q = $_REQUEST["q"];


//Dependendo de q, chama-se um metodo diferente - para retornar a resposta, fazemos por meio de echo
if($q == "poslinha"){ //metodo de teste para verificar uma possivel outra chamada
    echo pos_linha($site, $ckfile);
} elseif($q == "posicao") {
    echo posicao($site, $ckfile);
} else {
    echo "problema";
}


?>