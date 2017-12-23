# BusaodaMassa
Exercício de Programação criado para a disciplina de Soluções Web.  
  
    
O website inicialmente irá verificar se há como obter a geolocalização do usuário, centralizando a tela nele caso seja possível. Caso haja problemas, será disponibilizada uma mensagem de erro e a tela se centrará no campus da EACH. Todas as centralizações de tela seguem um zoom que mostrará cerca de 1km de conteúdo do mapa.  
  
A qualquer momento o usuário pode marcar os checkboxes para obter informações dos ônibus em circulação ou ainda encontrar paradas de ônibus (atualmente, apenas se contempla as paradas de corredores de ônibus). Caso o checkbox seja desmarcado, qualquer ponto relativo a aquele item irá ser deletado da tela. Cada ponto plottado pode apresentar informações mais detalhadas ao ser clicado, disponibilizando-se um box com, por exemplo, nome do ônibus, seu destino, dentre outros.  
  
Caso seja preciso buscar informações de alguma localização específica, é preciso que o usuário digite o endereço na caixa correspondente. O conteúdo a ser digitado é bastante flexível, pois será dada sugestões de endereços, servindo como um método de autocomplete, e mesmo que seja colocado algo simplista como "Av. Paulista", será buscado o centro da referida avenida. Após digitado o endereço e apertado o botão de busca, o mapa será recentralizado para o endereço. Como citado, o usuário pode a qualquer momento verificar a disponibilidade de ônibus e paradas, bastando assinalar o checkbox correspondente.  
  
As funções que retornam tanto os ônibus quanto as paradas fazem requisições à API da SPTrans, encontrando todos as ocorrências possíveis e filtrando de acordo com o que pode ser plottado dentro do frame do mapa atual. Por isso, há uma pequena demora dependendo das condições, podendo chegar a cinco segundos de espera para que todos os pontos sejam mostrados.  

Este projeto foi realizado por:  
  
Bruno Akio Shirasuna   nUSP 9778800  
Enzo Yamada Satake    nUSP 9844961  
Matheus Soares        nUSP 9761465
