# 1.1.2

- Os clipes de gravação agora aceitam velocidades de reprodução de até 10×.
- As gravações de janelas não piscam mais nas barras laterais translúcidas nem nas bordas da janela.

# 1.1.1

- Os ajustes de legendas estão sempre disponíveis; você pode adicionar legendas manualmente e excluir clipes de legenda ou palavra diretamente nas linhas do tempo.
- Os cantos de janela detectados automaticamente e as margens de Screens curvos agora têm suavização uniforme e consistente.
- Clipes de Zoom podem ser selecionados e redimensionados com segurança, mesmo com a linha do tempo ampliada.
- Os clipes não piscam mais ao ampliar ou reduzir a linha do tempo.
- O zoom da linha do tempo e o redimensionamento de clipes de Zoom permanecem fluidos em projetos com muitos clipes.

# 1.1.0

- O movimento do cursor agora pode inclinar levemente para a esquerda ou direita, com ângulo máximo ajustável.
- O desfoque de movimento da câmera surge e desaparece suavemente ao redor dos movimentos sem suavizar quadros estáticos da pré-visualização.
- As pré-visualizações ampliadas mantêm o texto da origem nítido quando os mockups usam fundos animados.
- O movimento e os pressionamentos longos do cursor agora permanecem consistentes entre a pré-visualização e a exportação, com interpolação adaptada à velocidade e desfoque de movimento adaptado ao zoom.
- A renderização do cursor não causa mais falha antes do primeiro evento de cursor gravado.
- As pré-visualizações após a gravação abrem com mais fluidez e o atalho de Espaço funciona sem permissão de Monitoramento de Entrada.
- Os fundos personalizados de Screen e mockup agora aceitam vídeos em loop suave com velocidade ajustável de 0,1× a 2× na pré-visualização e na exportação.
- O ScreenCam agora é exclusivo para Macs com Apple Silicon, reduzindo significativamente o tamanho da instalação.
- Fundos de vídeo personalizados em alta resolução permanecem fluidos, carregam com segurança em pré-visualizações pausadas sob carga do sistema e são exportados muito mais rápido.
- Exportações parciais mantêm os fundos de vídeo na posição correta da linha do tempo.
- A pré-visualização mantém o movimento do cursor sincronizado, enquanto o zoom e a câmera continuam suaves durante mudanças de velocidade.
- Os botões de proporção e recorte da tela não arrastam mais a janela do editor.
- Os clipes de Zoom manual permanecem estáveis até o fim do afastamento, mesmo com o foco próximo a uma borda.
- Os controles de sombra agora usam painéis bidimensionais com resposta tátil e ajustam direção, deslocamento, desfoque e intensidade ao tamanho do quadro; mesmo com grandes deslocamentos, as sombras permanecem suaves em vez de virarem blocos pretos sólidos.
- Os ajustes da janela agora permitem regular a suavidade dos cantos e configurar a espessura e a cor da borda, sem alterar a geometria do conteúdo capturado e mantendo bordas nítidas em todos os níveis de zoom.
- As molduras Screen mantêm cantos suaves, bordas limpas e sombras visíveis em fundos claros.
- O Quick Focus adiciona atalhos personalizáveis, zoom bloqueado interativo com navegação ao empurrar as bordas e troca fluida de nível, além de renderização ProMotion opcional de até 120 Hz.
- Controles deslizantes personalizados, entradas numéricas arrastáveis e interações precisas do editor agora oferecem resposta tátil do trackpad.
- As sobreposições de teclado mostram a tecla base correta e mantêm um pressionamento longo estável até a primeira liberação de tecla correspondente.
- Exportações com mixagem de áudio preservam o vídeo renderizado sem recodificação adicional e não falham mais quando uma faixa de áudio gravada é desativada.
- A barra de gravação permanece na tela correta em configurações com monitores dispostos verticalmente.
- Os clipes de Zoom manual agora usam um único centro e nível de zoom, com o minimapa nos ajustes do clipe.
- Clipes de Zoom adjacentes agora se movem e mudam de escala juntos, sem se fundir nem redefinir para 1x.
- As pré-visualizações ampliadas preservam os detalhes da fonte em qualquer tamanho de janela do editor.
- As pré-visualizações ao passar pela linha do tempo permanecem responsivas ao cruzar limites de clipes de Zoom.

# 1.0.9

- As âncoras manuais de Zoom agora usam controles ágeis de tela 1:1 com um minimapa alinhado à renderização.
- Os presets mantêm planos de fundo e papéis de parede personalizados disponíveis entre projetos, reinicializações e compartilhamento.
- As visualizações ampliadas mantêm o texto da origem nítido em janelas menores do editor.
- Os mockups de tela genérica podem ajustar tamanho da borda, raios dos cantos internos e externos, estilo do suporte e tamanho do suporte.
- As exportações agora verificam o espaço disponível em disco antes da renderização para evitar falhas no fim do processo.
- Gravações de tela e iPhone em alta taxa de quadros mantêm o áudio responsivo enquanto reduzem quadros redundantes enfileirados e renderizados.
- Exportações recortadas de vídeo, GIF e Live Photo começam a decodificar perto do intervalo selecionado, enquanto alterações apenas de áudio podem reutilizar o vídeo já renderizado.
- Visualização, linha do tempo, cursor, forma de onda, legendas, sobreposição da câmera e processamento do projeto usam caches limitados e trabalho compartilhado para deixar gravações longas mais fluidas.
- Exportações GIF e paralelas usam pipelines limitados e um agendamento de recursos mais justo para reduzir a contenção.
- As pré-visualizações ao passar pela linha do tempo não voltam mais para o quadro do cabeçote ao mover verticalmente entre clipes.
- Ao arrastar o cabeçote da linha do tempo durante a reprodução, a reprodução pausa e continua ao soltar.
- Cursores ao passar, cabeçotes de arraste e rótulos da régua da linha do tempo respondem melhor durante atualizações de pré-visualização, reprodução e limites de zoom.

# 1.0.8

- As gravações podem terminar em um cartão flutuante de ação rápida com miniaturas de visualização renderizadas, visualização repetida desde o início, edição, predefinição, exportação, salvamento, salvamento de origem e ações de rascunho.
- A remoção de fundo da câmera suporta estilo de adesivo em cache com contorno ajustável em escala de retrato, sombra e visualização de quadro.
- As configurações de aparência podem alternar o editor, os painéis do inspetor, as superfícies de exportação, a barra de ferramentas de gravação, as dicas de ferramentas e as visualizações de materiais entre os modos escuro, claro e automático.
- As configurações de idioma do app agora incluem chinês tradicional, espanhol, francês, português do Brasil e italiano.
- As sobreposições de câmera suportam mais proporções de aspecto, remoção de fundo com progresso inline, modo retrato transparente, planos de fundo de imagem personalizados empacotados e cópia de configurações com um clique para cada clipe de câmera.
- Os cartões de ação rápida são ocultados durante a seleção da captura, retornam após a gravação ou cancelamento, seguem a exibição ativa e mantêm todos os cartões visíveis clicáveis.
- As sobreposições de câmera de retrato transparente são exportadas corretamente, as edições de fundo gradiente atualizam a visualização imediatamente, as âncoras de zoom manual permanecem visíveis, o arrasto de entrada de número permanece estável nas bordas da tela e a tela de compra segue a aparência selecionada.

# 1.0.7

- As legendas suportam transcrição de provedor e modelo local, segmentos editáveis de leitura, visibilidade por legenda, estilo predefinido e fundos de exportação mais limpos.
- Os fundos de legenda suportam desfoque e materiais de vidro líquido com desfoque, saturação, estilo de vidro e tonalidade ajustáveis.
- As sobreposições de câmera suportam suavidade de canto ajustável e um estilo padrão quadrado mais suave.
- As camadas de efeito agora são denominadas Anotação em todo o editor.
- As configurações do editor podem reordenar e ocultar entradas de recursos, com Animação, Teclado e Beleza ocultos por padrão e entradas extras ocultas coletadas em More.
- As gravações aguardam entradas de tela, microfone e áudio do sistema habilitadas antes de gravar a mídia, e os sidecars de áudio atrasados permanecem alinhados na visualização, exportação, clipes da linha do tempo e formas de onda.
- A limpeza da câmera após falhas iniciais de gravação não trava mais, e falhas de gravação com pouco armazenamento mantêm a mídia recuperável com um aviso claro.
- As teclas do teclado desativadas permanecem ocultas após a reabertura de projetos, incluindo visualização e exportação.
- A abertura e as exportações do Project renderizam os quadros de vídeo iniciais de maneira confiável e os grupos densos de legenda e linha do tempo são separados corretamente após um zoom mais profundo.
- Os cursores suspensos da linha do tempo, os marcadores de reprodução e a ancoragem de zoom permanecem estáveis durante a reprodução, arrastar, rolar e aplicar zoom.
- A transcrição de legenda remota carrega áudio temporário otimizado para reduzir o tamanho da solicitação e capturar os limites de tamanho de arquivo do provedor mais cedo.
- Pré-visualizações de sobreposição de câmera, trilhas densas na linha do tempo e edição de segmentos de legenda respondem melhor em gravações longas.

# 1.0.6

- As gravações podem ser pausadas e retomadas na barra de ferramentas, barra de menu ou CLI, com o tempo de pausa omitido do espaço de trabalho salvo.
- As camadas de efeito de imagem podem aparecer e desaparecer gradualmente ou pular animações de entrada e saída.
- O título do cabeçalho do editor abre opções de espaço de trabalho para renomear e mostrar o arquivo .cam em Finder.
- Crop Source pode dimensionar as dimensões da fonte por proporção, largura ou altura.
- O preenchimento Screen Size pode ser ajustado por borda com um intervalo máximo mais alto e Device Padding suporta deslocamentos negativos de até 3.000 px.
- As gravações de rascunho permanecem separadas dos espaços de trabalho .cam salvos, mantêm opções de salvar/excluir em tempo fechado, aparecem em Recentes e salvam em pastas selecionadas sem autorização repetida ou erros de mídia ausente.
- As gravações de tela H.264 iniciam de forma confiável em sistemas que rejeitam dicas de codificador de taxa de quadros não suportadas.
- O desfazer do editor e a renderização do cursor de visualização são mais confiáveis durante desfazer repetidos e atualizações transitórias de layout.
- As sobreposições da câmera não ficam mais pretas depois de cortar um clipe de gravação até sua duração mínima e desfazê-lo.
- As visualizações de criação de trilha de zoom criam o clipe de zoom quando clicadas.
- Os efeitos de clique do cursor permanecem alinhados nos modelos iPhone giratórios.
- As bordas da maquete escondem lacunas finas sem sobressair na gravação.
- Os efeitos de clique do cursor são desativados por padrão e os cursores clicados encolhem com mais clareza.
- As formas de cursor gravadas preservam mais estados do sistema, com estilos de cursor personalizados voltando ao ponteiro padrão para formas não suportadas.
- A barra de ferramentas de gravação abre de forma confiável a partir do Dock, barra de menu e atalhos após alternar os espaços da área de trabalho, enquanto mantém seu vidro e posição durante a captura e gravação de áudio.
- A seleção de gravação da janela mantém um prompt compacto da barra de ferramentas com controles de saída Esc clicáveis.
- A reprodução da visualização do som do clique permanece responsiva em gravações com históricos densos de eventos de cursor.

# 1.0.5

- As exportações podem continuar em segundo plano com estimativas de tempo restante, uma superfície de progresso personalizável, ações de exportação concluídas e restauração de janela no estilo genie.
- A divisão da linha de tempo possui um modo dedicado com retenção Option, um cursor de tesoura e foco de gravação e áudio vinculado.
- As configurações do cursor podem ocultar um cursor inativo e usar sons de clique para download que são reproduzidos na visualização e exportação, com sons baixados disponíveis off-line.
- Os ativos do modelo podem ser baixados e atualizados do catálogo, com série, modelo, cor e opções de caixa e banda Apple Watch refletidas na visualização.
- A exportação GIF adiciona predefinições de resolução 1080p e inferiores e tamanho de arquivo estimado antes da exportação.
- Os espaços de trabalho existentes mantêm o modelo selecionado enquanto os ativos migrados terminam o download.
- As exportações GIF preservam as cores claras da interface do usuário e a geometria da camada de efeito com mais precisão.
- Alternar entre a exportação GIF e Live Photo mantém a visualização do corte estável e o seletor de formato GIF responde em todo o seu segmento.
- Clipes de linha de tempo muito curtos são mais fáceis de selecionar sem cortá-los acidentalmente.
- Os downloads de catálogos de modelo usam menos memória e as exportações longas de GIF alocam menos buffers de quadros.

# 1.0.4

- As sobreposições de visualização compartilham alças de redimensionamento quadradas, redimensionamento de bordas, redimensionamento de teclas modificadoras e arrasto direto do raio dos cantos.
- Os efeitos de foco podem cobrir todo o quadro durante a edição de gravações de maquete.
- Os clipes de efeitos mostram ícones de tipo, podem ser renomeados e usam conteúdo de texto como rótulos quando não têm nome.
- ScreenCam pode selecionar e gravar suas próprias janelas de aplicativos.
- A tela de compra oferece uma compra única ScreenCam Pro Lifetime junto com as assinaturas.
- O arrasto e o redimensionamento da sobreposição de visualização permanecem precisos durante o zoom e a escala automática da câmera.
- Os efeitos de texto mantêm o tamanho da fonte configurado quando as caixas de texto são redimensionadas para tamanhos menores.
- As máscaras de efeito de foco combinam melhor com os cantos da tela da maquete e os contornos de seleção.
- Pacotes de espaço de trabalho renomeados continuam salvando automaticamente sem alertas de mídia perdida.
- Os menus do dispositivo de gravação são atualizados quando microfones ou câmeras são conectados ou removidos.
- As gravações master cortadas podem ser arrastadas de volta à sua duração original e linhas de tempo densas rolam verticalmente em janelas curtas do editor.
- Barra de ferramentas Abrir espaço de trabalho começa na pasta padrão do espaço de trabalho de gravações.

# 1.0.3

- As camadas de efeito podem adicionar clipes de mosaico, foco, texto e imagem a partir de uma grade de visualização compacta, com posicionamento de linha do tempo em várias faixas e renderização de exportação.
- A edição de efeitos é mais precisa com edição de texto focada, layout de texto com zoom estável, posicionamento fora da tela, redimensionamento de visualização, edição com reconhecimento de zoom e visualizações de cantos de imagem ao vivo.
- A área da trilha da linha do tempo pode ser redimensionada, mantendo a visualização visível e evitando espaço vazio na trilha.
- Os comandos da área de trabalho CLI podem criar e atualizar clipes de efeitos.
- Sobre as configurações pode abrir o changelog do site.
- As configurações de eventos de teclado incluem uma opção Ativar tudo para as teclas selecionadas.
- O áudio do sistema gravado e as trilhas do microfone podem ser aumentados acima de 100%.
- O áudio do sistema gravado e os clipes de microfone permanecem alinhados com divisões, cortes e alterações de velocidade de gravação, com visualização estável e volume de exportação.
- Os medidores do microfone são animados corretamente durante a gravação de dispositivos de entrada de 24 bits.
- Os padrões de animação da câmera começam em um perfil de mola mais suave.
- A beleza da câmera começa com uma aparência padrão mais forte e natural.
- A música de fundo pode ser navegada, visualizada, importada do catálogo ou arquivos, ajustada por clipe e exportada com gravação de áudio.
- As gravações recém-terminadas recuperam a visualização do editor de forma mais confiável, incluindo carregamento de papel de parede e alterações na seleção de papel de parede de vídeo.
- A visualização do editor e as exportações de maquete correspondem melhor ao resultado final, incluindo bordas, layout de texto e tempo de animação de zoom.
- As trilhas ampliadas da linha do tempo mantêm réguas, marcadores de reprodução, visualizações instantâneas e cursores de clipe alinhados durante a rolagem horizontal e restauram a borda esquerda para 00:00 ao diminuir o zoom.
- A visualização do editor silencia totalmente o áudio do sistema quando seu clipe ou trilha é desativado ou excluído.
- A visualização de efeitos, a reprodução com zoom, a exportação e a edição em grandes espaços de trabalho são mais rápidas em linhas de tempo densas.

# 1.0.2

- Os links de suporte e documentos estão disponíveis em Configurações, Sobre e no menu Ajuda.
- As configurações de animação mostram o movimento primeiro e oferecem suporte a grupos recolhíveis.
- As entradas de número do editor usam alças de arrastar ícones e confirmam os valores digitados ao clicar fora do campo.
- Screen Size avisa sobre a exportação de barras pretas quando o plano de fundo é Nenhum e pode removê-las.
- As dimensões fixas da tela diminuem corretamente com proporções bloqueadas, com arrastamento de altura natural.
- Os clipes de zoom suportam níveis de escala de até 5x, com transições de zoom manuais mais estáveis.
- A gravação de visualizações da câmera explica que elas são apenas para visualização e podem ser ocultadas em gravações futuras.
- Zoom manual, seleção de papel de parede personalizado, alinhamento de eventos de teclado e edição de corte de origem são mais confiáveis.
- A beleza da câmera usa menos CPU na gravação de visualizações e na reprodução de visualizações do editor.
- A reprodução de visualização não bloqueia mais o fechamento do editor ou os painéis de arquivos nativos durante a renderização composta pesada.
- Os ajustes de beleza da câmera evitam o uso descontrolado da CPU na visualização.
- A beleza da câmera adiciona tonalidade natural localizada aos lábios, iluminação mais suave e melhor tratamento de manchas.
- Os espaços de trabalho .cam salvos automaticamente mantêm o acesso às pastas para que os salvamentos e fechamentos do editor sejam mais confiáveis em locais protegidos.
- As exportações de beleza da câmera terminam mais rapidamente, especialmente com sobreposições de câmera menores e saída de resolução mais baixa.
- Os menus de proporção mostram visualizações de formas para cada predefinição.
- As predefinições do editor são salvas sem travar o menu de predefinições.
- Os modelos de dispositivos reduzem a abertura da tela quando necessário, para que as gravações cubram a tela sem criar letras.
- As compras no Paywall evitam vincular a caixa de diálogo de confirmação da Apple a uma janela de aplicativo específica.
- A confirmação de assinatura da Apple é mais confiável em configurações com vários monitores, com diagnósticos focados em falhas de confirmação suspeitas.

# 1.0.1

- Novas gravações são salvas automaticamente como áreas de trabalho .cam em um local padrão configurável antes da abertura do editor.
- As configurações de gravação mostram o espaço de trabalho salvo automaticamente e o tamanho bruto do cache de gravação, com limpeza de itens antigos ou de todos os itens do cache.
- As configurações adicionam controles de aparência para cor do tema, material da barra de ferramentas e material da dica de ferramenta.
- As configurações incluem Abrir no login, teclas de atalho maiores durante a gravação, ligações de atalho removíveis e exportação recente de log de erros.
- O menu Arquivo adiciona submenus preguiçosos Recente e Diretório padrão para abrir espaços de trabalho salvos.
- O cabeçalho do editor adiciona ações predefinidas para salvar, renomear, reordenar, excluir, aplicar, compartilhar e importar.
- O cabeçalho do editor adiciona mais predefinições de aspecto de tela de exportação, controles de corte de origem e exportações de origem com limite de 5K.
- O título do editor pode revelar a área de trabalho em Finder.
- A ordem das trilhas na linha do tempo persiste como uma preferência do editor enquanto as trilhas ocultas são redefinidas por sessão.
- A linha do tempo e o corte de origem suportam zoom de pinça do trackpad, com movimento panorâmico na folha de corte após o zoom.
- A seleção de área oferece suporte a dimensões digitadas, guias centrais, predefinições de proporção de aspecto e atalhos de redimensionamento Shift/Option.
- Os controles de visualização da linha do tempo adicionam velocidades de reprodução de 0,25x a 2x.
- Os filtros de beleza da câmera podem ser visualizados e alternados durante a gravação, salvos como padrões, ajustados posteriormente e refinados com controles de formato com reconhecimento de rosto.
- As configurações padrão de animação da câmera usam um perfil de mola mais suave e desfoque de movimento mais forte para zooms mais suaves.
- A visualização do movimento da câmera mantém os caminhos de zoom in e zoom out retos e usa desfoque de movimento direcional a partir do centro de zoom correto.
- A reprodução do cursor segue o movimento gravado com menos atraso.
- A posição do cursor e o foco da câmera permanecem alinhados após o corte da fonte.
- As sobreposições da câmera permanecem sincronizadas com o quadro durante a reprodução da visualização.
- A parada de gravação muda para Processing imediatamente e mantém a finalização ativa por mais tempo.
- A barra de ferramentas flutuante de gravação permanece visível ao alternar entre áreas de trabalho durante a gravação.
- Os medidores de áudio da barra de ferramentas de gravação mostram um movimento de nível mais claro.
- A seleção de captura de área vem de forma confiável para a frente a partir da barra de ferramentas de gravação flutuante.
- A seleção de captura de janela e área funciona em monitores secundários.
- Recusar a permissão de gravação de tela cancela a gravação sem mostrar um erro.
- Os controles de seleção de captura evitam travamentos do Intel TestFlight, incluindo foco no alvo, atualizações do menu de status da barra de menus e reabertura do Dock.
- O botão de cancelamento da seleção de captura responde através do controle circular completo.
- Passar o mouse sobre o botão Iniciar seleção de captura não trava mais o aplicativo.
- As gravações com áudio do sistema habilitado terminam sem travar no processamento Pro.
- Fechar ou sair com um editor não salvo mostra o fluxo de fechamento do ScreenCam em vez do painel de salvamento de documentos do sistema.
- O salvamento automático do espaço de trabalho aguarda enquanto os painéis de arquivos nativos estão abertos e grava pacotes .cam com mais segurança.
- A limpeza da linha do tempo e as interações interrompidas não deixam mais a reprodução da visualização congelada ou saltando para o final.
- Redimensionar ou arrastar clipes da linha do tempo não salta mais o cursor de reprodução ao capturar um clipe.
- Os controles de volume e mudo de áudio de visualização permanecem sincronizados, animam suavemente e não adicionam mais etapas de desfazer.
- Os seletores de cores aceitam valores hexadecimais digitados e mantêm as alças de arrastar ancoradas durante o ajuste da cor.
- Os rótulos do inspetor usam a terminologia Tela e Dispositivo, e o seletor de predefinições de tamanho corresponde a outros controles de menu.
- As dicas de ferramentas aparecem nos controles de gravação, guias do inspetor e atalhos para desfazer/refazer.
- O material transparente da dica de ferramenta mantém as bolhas visíveis em fundos brancos.
- Os vídeos MP4 exportados usam ordenação de quadros H.264 compatível com visualização, evitam metadados de quarentena e mantêm o tempo de áudio em velocidade normal.
- O dimensionamento de exportação com resolução de origem usa a composição de visualização final, incluindo preenchimento de quadro, tamanho fixo de tela e tamanho de maquete.
- As telas exportadas evitam barras pretas nas bordas causadas pelo arredondamento de pixels.
- As exportações de maquete de exibição renderizam papéis de parede animados e fundos de quadros corretamente dentro do quadro da tela.
- A maquete de laptop exporta conteúdo de gravação de clipe para cantos arredondados da tela.
- Os zooms de maquete podem seguir o movimento do cursor além da borda de origem sem ajustar o dispositivo ampliado à borda da tela.
- Clipes de gravação repetidos são exportados dos quadros de origem corretos, em vez de quadros finais obsoletos.
- As exportações de 4K começam de forma confiável em gravações de alta resolução, em vez de estagnarem em torno de 3%.
- Exportações longas com papéis de parede animados ou sobreposições de câmera não param mais perto de 79%.
- As exportações de áudio de volume total preservam a taxa de bits de vídeo H.264 renderizada em vez de aumentar o tamanho do arquivo durante a mixagem de áudio.
- Gravação, visualização de reprodução, exportação de alta resolução e grandes cronogramas de teclado usam menos CPU e memória.
- Os botões de semáforo do editor mantêm o posicionamento nativo durante as transições em tela cheia.
