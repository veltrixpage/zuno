/**
 * Banco do curso: cada linha é a MESMA ideia nos 9 idiomas do app.
 * Ordem: [pt, en, es, it, fr, de, ja, ko, zh]
 * Em ja/ko/zh, "texto|leitura" traz a romanização (usada nos níveis A1 e A2).
 * Expressões idiomáticas usam o equivalente natural de cada idioma, não a tradução literal.
 *
 * Cada unidade: { slug, title, skills, grammar (nota em português), items }
 */
export const BANK = {
  A1: [
    {
      slug: 'cumprimentos', title: 'Cumprimentos', skills: ['vocabulário', 'listening', 'speaking'],
      grammar: 'Cumprimentos mudam conforme a hora do dia e o quanto você conhece a pessoa. Comece por eles: são as frases que você mais vai usar.',
      items: [
        ['olá', 'hello', 'hola', 'ciao', 'salut', 'hallo', 'こんにちは|konnichiwa', '안녕하세요|annyeonghaseyo', '你好|nǐ hǎo'],
        ['bom dia', 'good morning', 'buenos días', 'buongiorno', 'bonjour', 'guten Morgen', 'おはようございます|ohayō gozaimasu', '좋은 아침이에요|joeun achimieyo', '早上好|zǎoshang hǎo'],
        ['obrigado', 'thank you', 'gracias', 'grazie', 'merci', 'danke', 'ありがとう|arigatō', '감사합니다|gamsahamnida', '谢谢|xièxie'],
        ['boa noite', 'good night', 'buenas noches', 'buonanotte', 'bonne nuit', 'gute Nacht', 'おやすみなさい|oyasuminasai', '안녕히 주무세요|annyeonghi jumuseyo', '晚安|wǎn’ān'],
        ['tchau', 'goodbye', 'adiós', 'arrivederci', 'au revoir', 'tschüss', 'さようなら|sayōnara', '안녕히 가세요|annyeonghi gaseyo', '再见|zàijiàn'],
        ['por favor', 'please', 'por favor', 'per favore', 's’il vous plaît', 'bitte', 'お願いします|onegaishimasu', '부탁해요|butakaeyo', '请|qǐng'],
        ['desculpe', 'sorry', 'perdón', 'scusa', 'pardon', 'Entschuldigung', 'すみません|sumimasen', '죄송합니다|joesonghamnida', '对不起|duìbuqǐ'],
        ['de nada', 'you’re welcome', 'de nada', 'prego', 'de rien', 'gern geschehen', 'どういたしまして|dōitashimashite', '천만에요|cheonmaneyo', '不客气|bú kèqi'],
      ],
    },
    {
      slug: 'apresentacoes', title: 'Apresentações', skills: ['vocabulário', 'gramática', 'speaking'],
      grammar: 'Para se apresentar você precisa de três coisas: seu nome, de onde você é e uma pergunta para a outra pessoa.',
      items: [
        ['meu nome é Ana', 'my name is Ana', 'me llamo Ana', 'mi chiamo Ana', 'je m’appelle Ana', 'ich heiße Ana', '私はアナです|watashi wa Ana desu', '제 이름은 아나예요|je ireumeun Ana-yeyo', '我叫安娜|wǒ jiào Ānnà'],
        ['eu sou do Brasil', 'I’m from Brazil', 'soy de Brasil', 'vengo dal Brasile', 'je viens du Brésil', 'ich komme aus Brasilien', 'ブラジルから来ました|Burajiru kara kimashita', '브라질에서 왔어요|beurajil-eseo wasseoyo', '我来自巴西|wǒ láizì Bāxī'],
        ['prazer em conhecer', 'nice to meet you', 'mucho gusto', 'piacere', 'enchanté', 'freut mich', 'はじめまして|hajimemashite', '반갑습니다|bangapseumnida', '很高兴认识你|hěn gāoxìng rènshi nǐ'],
        ['como você se chama?', 'what’s your name?', '¿cómo te llamas?', 'come ti chiami?', 'comment tu t’appelles ?', 'wie heißt du?', 'お名前は？|onamae wa?', '이름이 뭐예요?|ireumi mwoyeyo?', '你叫什么名字？|nǐ jiào shénme míngzi?'],
        ['eu sou estudante', 'I’m a student', 'soy estudiante', 'sono studente', 'je suis étudiant', 'ich bin Student', '学生です|gakusei desu', '저는 학생이에요|jeoneun haksaeng-ieyo', '我是学生|wǒ shì xuésheng'],
        ['como vai?', 'how are you?', '¿cómo estás?', 'come stai?', 'comment ça va ?', 'wie geht’s?', 'お元気ですか？|ogenki desu ka?', '잘 지내요?|jal jinaeyo?', '你好吗？|nǐ hǎo ma?'],
      ],
    },
    {
      slug: 'numeros', title: 'Números', skills: ['vocabulário', 'listening'],
      grammar: 'Números aparecem em preços, horários e idades. Ouça cada um e repita até sair sem pensar.',
      items: [
        ['um', 'one', 'uno', 'uno', 'un', 'eins', '一|ichi', '하나|hana', '一|yī'],
        ['dois', 'two', 'dos', 'due', 'deux', 'zwei', '二|ni', '둘|dul', '二|èr'],
        ['três', 'three', 'tres', 'tre', 'trois', 'drei', '三|san', '셋|set', '三|sān'],
        ['quatro', 'four', 'cuatro', 'quattro', 'quatre', 'vier', '四|yon', '넷|net', '四|sì'],
        ['cinco', 'five', 'cinco', 'cinque', 'cinq', 'fünf', '五|go', '다섯|daseot', '五|wǔ'],
        ['dez', 'ten', 'diez', 'dieci', 'dix', 'zehn', '十|jū', '열|yeol', '十|shí'],
        ['vinte', 'twenty', 'veinte', 'venti', 'vingt', 'zwanzig', '二十|nijū', '스물|seumul', '二十|èrshí'],
        ['cem', 'one hundred', 'cien', 'cento', 'cent', 'hundert', '百|hyaku', '백|baek', '一百|yìbǎi'],
      ],
    },
    {
      slug: 'cores', title: 'Cores', skills: ['vocabulário', 'reading'],
      grammar: 'Cores ajudam a descrever coisas. Em vários idiomas elas mudam conforme a palavra que acompanham; por enquanto, aprenda a forma básica.',
      items: [
        ['vermelho', 'red', 'rojo', 'rosso', 'rouge', 'rot', '赤|aka', '빨간색|ppalgansaek', '红色|hóngsè'],
        ['azul', 'blue', 'azul', 'blu', 'bleu', 'blau', '青|ao', '파란색|paransaek', '蓝色|lánsè'],
        ['verde', 'green', 'verde', 'verde', 'vert', 'grün', '緑|midori', '초록색|choroksaek', '绿色|lǜsè'],
        ['amarelo', 'yellow', 'amarillo', 'giallo', 'jaune', 'gelb', '黄色|kiiro', '노란색|noransaek', '黄色|huángsè'],
        ['preto', 'black', 'negro', 'nero', 'noir', 'schwarz', '黒|kuro', '검은색|geomeunsaek', '黑色|hēisè'],
        ['branco', 'white', 'blanco', 'bianco', 'blanc', 'weiß', '白|shiro', '흰색|huinsaek', '白色|báisè'],
      ],
    },
    {
      slug: 'familia', title: 'Família', skills: ['vocabulário', 'speaking'],
      grammar: 'Palavras de família são ótimas para praticar frases como “esta é a minha mãe”.',
      items: [
        ['mãe', 'mother', 'madre', 'madre', 'mère', 'Mutter', '母|haha', '어머니|eomeoni', '妈妈|māma'],
        ['pai', 'father', 'padre', 'padre', 'père', 'Vater', '父|chichi', '아버지|abeoji', '爸爸|bàba'],
        ['irmão', 'brother', 'hermano', 'fratello', 'frère', 'Bruder', '兄弟|kyōdai', '형제|hyeongje', '兄弟|xiōngdì'],
        ['irmã', 'sister', 'hermana', 'sorella', 'sœur', 'Schwester', '姉妹|shimai', '자매|jamae', '姐妹|jiěmèi'],
        ['filho', 'son', 'hijo', 'figlio', 'fils', 'Sohn', '息子|musuko', '아들|adeul', '儿子|érzi'],
        ['filha', 'daughter', 'hija', 'figlia', 'fille', 'Tochter', '娘|musume', '딸|ttal', '女儿|nǚ’ér'],
        ['avó', 'grandmother', 'abuela', 'nonna', 'grand-mère', 'Großmutter', '祖母|sobo', '할머니|halmeoni', '奶奶|nǎinai'],
        ['avô', 'grandfather', 'abuelo', 'nonno', 'grand-père', 'Großvater', '祖父|sofu', '할아버지|harabeoji', '爷爷|yéye'],
      ],
    },
    {
      slug: 'comida', title: 'Comida e bebida', skills: ['vocabulário', 'speaking', 'writing'],
      grammar: 'Com “eu quero…” e algumas palavras de comida você já consegue pedir algo num café ou restaurante.',
      items: [
        ['água', 'water', 'agua', 'acqua', 'eau', 'Wasser', '水|mizu', '물|mul', '水|shuǐ'],
        ['café', 'coffee', 'café', 'caffè', 'café', 'Kaffee', 'コーヒー|kōhī', '커피|keopi', '咖啡|kāfēi'],
        ['pão', 'bread', 'pan', 'pane', 'pain', 'Brot', 'パン|pan', '빵|ppang', '面包|miànbāo'],
        ['maçã', 'apple', 'manzana', 'mela', 'pomme', 'Apfel', 'りんご|ringo', '사과|sagwa', '苹果|píngguǒ'],
        ['arroz', 'rice', 'arroz', 'riso', 'riz', 'Reis', 'ご飯|gohan', '밥|bap', '米饭|mǐfàn'],
        ['eu quero um café', 'I want a coffee', 'quiero un café', 'vorrei un caffè', 'je voudrais un café', 'ich möchte einen Kaffee', 'コーヒーをください|kōhī o kudasai', '커피 주세요|keopi juseyo', '我要一杯咖啡|wǒ yào yì bēi kāfēi'],
        ['estou com fome', 'I’m hungry', 'tengo hambre', 'ho fame', 'j’ai faim', 'ich habe Hunger', 'お腹が空きました|onaka ga sukimashita', '배고파요|baegopayo', '我饿了|wǒ è le'],
      ],
    },
    {
      slug: 'rotina', title: 'Rotina e verbos básicos', skills: ['gramática', 'vocabulário', 'speaking'],
      grammar: 'Presente simples: use para o que você faz sempre. O verbo muda conforme a pessoa (eu, você, ele…).',
      items: [
        ['eu acordo cedo', 'I wake up early', 'me despierto temprano', 'mi sveglio presto', 'je me réveille tôt', 'ich wache früh auf', '私は早く起きます|watashi wa hayaku okimasu', '저는 일찍 일어나요|jeoneun iljjik ireonayo', '我起得很早|wǒ qǐ de hěn zǎo'],
        ['eu trabalho', 'I work', 'trabajo', 'lavoro', 'je travaille', 'ich arbeite', '私は働きます|watashi wa hatarakimasu', '저는 일해요|jeoneun ilhaeyo', '我工作|wǒ gōngzuò'],
        ['eu estudo', 'I study', 'estudio', 'studio', 'j’étudie', 'ich lerne', '勉強します|benkyō shimasu', '공부해요|gongbuhaeyo', '我学习|wǒ xuéxí'],
        ['eu durmo', 'I sleep', 'duermo', 'dormo', 'je dors', 'ich schlafe', '寝ます|nemasu', '자요|jayo', '我睡觉|wǒ shuìjiào'],
        ['todos os dias', 'every day', 'todos los días', 'ogni giorno', 'tous les jours', 'jeden Tag', '毎日|mainichi', '매일|maeil', '每天|měitiān'],
        ['à noite', 'at night', 'por la noche', 'di sera', 'le soir', 'am Abend', '夜に|yoru ni', '밤에|bame', '晚上|wǎnshang'],
      ],
    },
    {
      slug: 'perguntas', title: 'Perguntas simples', skills: ['speaking', 'listening', 'revisão'],
      grammar: 'Perguntas curtas resolvem a maior parte das situações de viagem. Aprenda também a pedir para repetirem.',
      items: [
        ['onde é o banheiro?', 'where is the bathroom?', '¿dónde está el baño?', 'dov’è il bagno?', 'où sont les toilettes ?', 'wo ist die Toilette?', 'トイレはどこですか？|toire wa doko desu ka?', '화장실이 어디예요?|hwajangsiri eodiyeyo?', '洗手间在哪儿？|xǐshǒujiān zài nǎr?'],
        ['quanto custa?', 'how much is it?', '¿cuánto cuesta?', 'quanto costa?', 'combien ça coûte ?', 'wie viel kostet das?', 'いくらですか？|ikura desu ka?', '얼마예요?|eolmayeyo?', '多少钱？|duōshao qián?'],
        ['que horas são?', 'what time is it?', '¿qué hora es?', 'che ore sono?', 'quelle heure est-il ?', 'wie spät ist es?', '何時ですか？|nanji desu ka?', '몇 시예요?|myeot siyeyo?', '几点了？|jǐ diǎn le?'],
        ['eu não entendo', 'I don’t understand', 'no entiendo', 'non capisco', 'je ne comprends pas', 'ich verstehe nicht', 'わかりません|wakarimasen', '이해가 안 돼요|ihaega an dwaeyo', '我不明白|wǒ bù míngbai'],
        ['pode repetir?', 'can you repeat that?', '¿puede repetir?', 'può ripetere?', 'vous pouvez répéter ?', 'können Sie das wiederholen?', 'もう一度お願いします|mō ichido onegaishimasu', '다시 말해 주세요|dasi malhae juseyo', '请再说一遍|qǐng zài shuō yí biàn'],
        ['fale devagar, por favor', 'please speak slowly', 'hable despacio, por favor', 'parli piano, per favore', 'parlez lentement, s’il vous plaît', 'bitte sprechen Sie langsam', 'ゆっくり話してください|yukkuri hanashite kudasai', '천천히 말해 주세요|cheoncheonhi malhae juseyo', '请说慢一点|qǐng shuō màn yìdiǎn'],
      ],
    },
  ],

  A2: [
    {
      slug: 'passado', title: 'O que aconteceu (passado)', skills: ['gramática', 'speaking', 'listening'],
      grammar: 'Passado: para contar o que já aconteceu. Repare como o verbo muda em relação ao presente.',
      items: [
        ['ontem eu fui ao mercado', 'yesterday I went to the market', 'ayer fui al mercado', 'ieri sono andato al mercato', 'hier je suis allé au marché', 'gestern bin ich zum Markt gegangen', '昨日スーパーに行きました|kinō sūpā ni ikimashita', '어제 시장에 갔어요|eoje sijang-e gasseoyo', '昨天我去了市场|zuótiān wǒ qù le shìchǎng'],
        ['eu comi pizza', 'I ate pizza', 'comí pizza', 'ho mangiato la pizza', 'j’ai mangé une pizza', 'ich habe Pizza gegessen', 'ピザを食べました|piza o tabemashita', '피자를 먹었어요|pijareul meogeosseoyo', '我吃了披萨|wǒ chī le pīsà'],
        ['eu vi um filme', 'I watched a movie', 'vi una película', 'ho visto un film', 'j’ai vu un film', 'ich habe einen Film gesehen', '映画を見ました|eiga o mimashita', '영화를 봤어요|yeonghwareul bwasseoyo', '我看了一部电影|wǒ kàn le yí bù diànyǐng'],
        ['eu trabalhei muito', 'I worked a lot', 'trabajé mucho', 'ho lavorato molto', 'j’ai beaucoup travaillé', 'ich habe viel gearbeitet', 'たくさん働きました|takusan hatarakimashita', '일을 많이 했어요|ireul mani haesseoyo', '我工作了很久|wǒ gōngzuò le hěn jiǔ'],
        ['foi divertido', 'it was fun', 'fue divertido', 'è stato divertente', 'c’était amusant', 'es hat Spaß gemacht', '楽しかったです|tanoshikatta desu', '재미있었어요|jaemiisseosseoyo', '很好玩|hěn hǎowán'],
      ],
    },
    {
      slug: 'futuro', title: 'Planos e futuro', skills: ['gramática', 'speaking'],
      grammar: 'Futuro: para planos e intenções. Muitas línguas usam uma forma com “ir” (eu vou…), como o português.',
      items: [
        ['amanhã eu vou viajar', 'tomorrow I’m going to travel', 'mañana voy a viajar', 'domani parto', 'demain je vais voyager', 'morgen verreise ich', '明日旅行します|ashita ryokō shimasu', '내일 여행을 갈 거예요|naeil yeohaeng-eul gal geoyeyo', '明天我要去旅行|míngtiān wǒ yào qù lǚxíng'],
        ['eu vou estudar mais', 'I’m going to study more', 'voy a estudiar más', 'studierò di più', 'je vais étudier plus', 'ich werde mehr lernen', 'もっと勉強します|motto benkyō shimasu', '더 공부할 거예요|deo gongbuhal geoyeyo', '我会多学习|wǒ huì duō xuéxí'],
        ['no fim de semana', 'on the weekend', 'el fin de semana', 'nel fine settimana', 'le week-end', 'am Wochenende', '週末に|shūmatsu ni', '주말에|jumare', '周末|zhōumò'],
        ['nós vamos jantar fora', 'we’re going to eat out', 'vamos a cenar fuera', 'andiamo a cena fuori', 'on va dîner dehors', 'wir gehen auswärts essen', '外で晩ご飯を食べます|soto de bangohan o tabemasu', '우리는 외식할 거예요|urineun oesikal geoyeyo', '我们要出去吃饭|wǒmen yào chūqù chīfàn'],
        ['talvez', 'maybe', 'quizás', 'forse', 'peut-être', 'vielleicht', 'たぶん|tabun', '아마|ama', '也许|yěxǔ'],
      ],
    },
    {
      slug: 'descricoes', title: 'Descrições', skills: ['vocabulário', 'reading', 'writing'],
      grammar: 'Para descrever pessoas, lugares e o tempo, você usa “ser”, “estar” e adjetivos.',
      items: [
        ['ele é alto', 'he is tall', 'él es alto', 'lui è alto', 'il est grand', 'er ist groß', '彼は背が高いです|kare wa se ga takai desu', '그는 키가 커요|geuneun kiga keoyo', '他很高|tā hěn gāo'],
        ['a casa é grande', 'the house is big', 'la casa es grande', 'la casa è grande', 'la maison est grande', 'das Haus ist groß', '家は大きいです|ie wa ōkii desu', '집이 커요|jibi keoyo', '房子很大|fángzi hěn dà'],
        ['ela é simpática', 'she is nice', 'ella es simpática', 'lei è simpatica', 'elle est sympathique', 'sie ist nett', '彼女は優しいです|kanojo wa yasashii desu', '그녀는 친절해요|geunyeoneun chinjeolhaeyo', '她很友好|tā hěn yǒuhǎo'],
        ['está frio', 'it’s cold', 'hace frío', 'fa freddo', 'il fait froid', 'es ist kalt', '寒いです|samui desu', '추워요|chuwoyo', '很冷|hěn lěng'],
        ['o dia está bonito', 'it’s a beautiful day', 'hace un día bonito', 'è una bella giornata', 'il fait beau', 'es ist ein schöner Tag', 'いい天気です|ii tenki desu', '날씨가 좋아요|nalssiga joayo', '天气很好|tiānqì hěn hǎo'],
      ],
    },
    {
      slug: 'viagens', title: 'Viagens', skills: ['vocabulário', 'listening', 'speaking'],
      grammar: 'Em viagem, frases educadas com “eu gostaria…” funcionam melhor que ordens diretas.',
      items: [
        ['passaporte', 'passport', 'pasaporte', 'passaporto', 'passeport', 'Reisepass', 'パスポート|pasupōto', '여권|yeogwon', '护照|hùzhào'],
        ['passagem', 'ticket', 'billete', 'biglietto', 'billet', 'Fahrkarte', '切符|kippu', '표|pyo', '票|piào'],
        ['onde fica a estação?', 'where is the station?', '¿dónde está la estación?', 'dov’è la stazione?', 'où est la gare ?', 'wo ist der Bahnhof?', '駅はどこですか？|eki wa doko desu ka?', '역이 어디예요?|yeogi eodiyeyo?', '车站在哪儿？|chēzhàn zài nǎr?'],
        ['eu gostaria de um quarto', 'I’d like a room', 'quisiera una habitación', 'vorrei una camera', 'je voudrais une chambre', 'ich hätte gern ein Zimmer', '部屋をお願いします|heya o onegai shimasu', '방 하나 주세요|bang hana juseyo', '我想要一个房间|wǒ xiǎng yào yí ge fángjiān'],
        ['mala', 'suitcase', 'maleta', 'valigia', 'valise', 'Koffer', 'スーツケース|sūtsukēsu', '여행 가방|yeohaeng gabang', '行李箱|xínglixiāng'],
      ],
    },
    {
      slug: 'compras', title: 'Compras', skills: ['vocabulário', 'speaking', 'listening'],
      grammar: 'Numa loja você pergunta o preço, compara e decide. “Vou levar” fecha a compra.',
      items: [
        ['quanto custa isto?', 'how much does this cost?', '¿cuánto cuesta esto?', 'quanto costa questo?', 'combien coûte ceci ?', 'was kostet das hier?', 'これはいくらですか？|kore wa ikura desu ka?', '이거 얼마예요?|igeo eolmayeyo?', '这个多少钱？|zhège duōshao qián?'],
        ['é muito caro', 'it’s too expensive', 'es muy caro', 'è troppo caro', 'c’est trop cher', 'das ist zu teuer', '高すぎます|takasugimasu', '너무 비싸요|neomu bissayo', '太贵了|tài guì le'],
        ['você aceita cartão?', 'do you take cards?', '¿acepta tarjeta?', 'accettate carte?', 'vous acceptez la carte ?', 'kann ich mit Karte zahlen?', 'カードは使えますか？|kādo wa tsukaemasu ka?', '카드 돼요?|kadeu dwaeyo?', '可以刷卡吗？|kěyǐ shuākǎ ma?'],
        ['eu vou levar', 'I’ll take it', 'me lo llevo', 'lo prendo', 'je le prends', 'ich nehme es', 'これにします|kore ni shimasu', '이걸로 할게요|igeollo halgeyo', '我要这个|wǒ yào zhège'],
        ['desconto', 'discount', 'descuento', 'sconto', 'réduction', 'Rabatt', '割引|waribiki', '할인|harin', '折扣|zhékòu'],
      ],
    },
    {
      slug: 'trabalho', title: 'Trabalho', skills: ['vocabulário', 'writing', 'reading'],
      grammar: 'No trabalho, frases curtas e claras sobre horários e pessoas resolvem muita coisa.',
      items: [
        ['reunião', 'meeting', 'reunión', 'riunione', 'réunion', 'Besprechung', '会議|kaigi', '회의|hoeui', '会议|huìyì'],
        ['eu trabalho em um escritório', 'I work in an office', 'trabajo en una oficina', 'lavoro in un ufficio', 'je travaille dans un bureau', 'ich arbeite in einem Büro', '事務所で働いています|jimusho de hataraite imasu', '사무실에서 일해요|samusil-eseo ilhaeyo', '我在办公室工作|wǒ zài bàngōngshì gōngzuò'],
        ['eu tenho uma reunião às dez', 'I have a meeting at ten', 'tengo una reunión a las diez', 'ho una riunione alle dieci', 'j’ai une réunion à dix heures', 'ich habe um zehn eine Besprechung', '十時に会議があります|jūji ni kaigi ga arimasu', '열 시에 회의가 있어요|yeol si-e hoeuiga isseoyo', '我十点有个会|wǒ shí diǎn yǒu ge huì'],
        ['colega', 'colleague', 'colega', 'collega', 'collègue', 'Kollege', '同僚|dōryō', '동료|dongnyo', '同事|tóngshì'],
        ['chefe', 'boss', 'jefe', 'capo', 'patron', 'Chef', '上司|jōshi', '상사|sangsa', '老板|lǎobǎn'],
      ],
    },
  ],

  B1: [
    {
      slug: 'opinioes', title: 'Opiniões', skills: ['speaking', 'vocabulário'],
      grammar: 'Dar opinião com suavidade (“eu acho que…”, “depende”) soa mais natural do que respostas secas.',
      items: [
        ['eu acho que sim', 'I think so', 'creo que sí', 'penso di sì', 'je pense que oui', 'ich glaube schon', 'そう思います', '그런 것 같아요', '我觉得是'],
        ['na minha opinião', 'in my opinion', 'en mi opinión', 'secondo me', 'à mon avis', 'meiner Meinung nach', '私の意見では', '제 생각에는', '在我看来'],
        ['eu concordo', 'I agree', 'estoy de acuerdo', 'sono d’accordo', 'je suis d’accord', 'ich stimme zu', '賛成です', '동의해요', '我同意'],
        ['eu discordo', 'I disagree', 'no estoy de acuerdo', 'non sono d’accordo', 'je ne suis pas d’accord', 'ich bin anderer Meinung', '反対です', '동의하지 않아요', '我不同意'],
        ['depende', 'it depends', 'depende', 'dipende', 'ça dépend', 'es kommt darauf an', '場合によります', '경우에 따라 달라요', '看情况'],
      ],
    },
    {
      slug: 'experiencias', title: 'Experiências', skills: ['gramática', 'speaking', 'listening'],
      grammar: 'Para falar de experiências de vida (“já fiz”, “nunca fiz”), muitas línguas usam um tempo verbal próprio.',
      items: [
        ['eu já morei no exterior', 'I have lived abroad', 'he vivido en el extranjero', 'ho vissuto all’estero', 'j’ai vécu à l’étranger', 'ich habe im Ausland gelebt', '海外に住んだことがあります', '외국에서 살아 본 적이 있어요', '我在国外住过'],
        ['eu nunca fui ao Japão', 'I have never been to Japan', 'nunca he ido a Japón', 'non sono mai stato in Giappone', 'je ne suis jamais allé au Japon', 'ich war noch nie in Japan', '日本に行ったことがありません', '일본에 가 본 적이 없어요', '我从来没去过日本'],
        ['foi uma experiência incrível', 'it was an amazing experience', 'fue una experiencia increíble', 'è stata un’esperienza incredibile', 'c’était une expérience incroyable', 'es war eine unglaubliche Erfahrung', '素晴らしい経験でした', '정말 멋진 경험이었어요', '那是一次很棒的经历'],
        ['eu tenho aprendido muito', 'I’ve been learning a lot', 'estoy aprendiendo mucho', 'sto imparando molto', 'j’apprends beaucoup', 'ich lerne viel', 'たくさん学んでいます', '많이 배우고 있어요', '我学到了很多'],
        ['desde criança', 'since I was a child', 'desde niño', 'fin da bambino', 'depuis que je suis enfant', 'seit meiner Kindheit', '子供の頃から', '어렸을 때부터', '从小'],
      ],
    },
    {
      slug: 'explicacoes', title: 'Explicar e conectar ideias', skills: ['gramática', 'writing'],
      grammar: 'Conectores ligam as ideias: causa (porque), consequência (por isso), exemplo (por exemplo).',
      items: [
        ['porque', 'because', 'porque', 'perché', 'parce que', 'weil', 'なぜなら', '왜냐하면', '因为'],
        ['por isso', 'that’s why', 'por eso', 'per questo', 'c’est pourquoi', 'deshalb', 'だから', '그래서', '所以'],
        ['por exemplo', 'for example', 'por ejemplo', 'per esempio', 'par exemple', 'zum Beispiel', '例えば', '예를 들어', '例如'],
        ['ou seja', 'in other words', 'es decir', 'cioè', 'c’est-à-dire', 'das heißt', 'つまり', '즉', '也就是说'],
        ['mesmo assim', 'even so', 'aun así', 'comunque', 'quand même', 'trotzdem', 'それでも', '그래도', '即便如此'],
      ],
    },
    {
      slug: 'narrativas', title: 'Contar histórias', skills: ['listening', 'reading', 'speaking'],
      grammar: 'Uma boa história tem ordem: começo, algo inesperado (“de repente”) e um final.',
      items: [
        ['quando eu era criança', 'when I was a child', 'cuando era niño', 'quando ero bambino', 'quand j’étais petit', 'als ich ein Kind war', '子供の頃', '어렸을 때', '我小时候'],
        ['de repente', 'suddenly', 'de repente', 'all’improvviso', 'soudain', 'plötzlich', '突然', '갑자기', '突然'],
        ['no fim', 'in the end', 'al final', 'alla fine', 'à la fin', 'am Ende', '結局', '결국', '最后'],
        ['enquanto eu caminhava', 'while I was walking', 'mientras caminaba', 'mentre camminavo', 'pendant que je marchais', 'während ich spazieren ging', '歩いている間に', '걷고 있을 때', '我走路的时候'],
        ['primeiro… depois', 'first… then', 'primero… después', 'prima… poi', 'd’abord… ensuite', 'zuerst… dann', 'まず…それから', '먼저… 그다음에', '首先……然后'],
      ],
    },
    {
      slug: 'profissional', title: 'Situações profissionais', skills: ['speaking', 'writing'],
      grammar: 'No trabalho, o tom importa: “eu gostaria de…” é educado e direto ao mesmo tempo.',
      items: [
        ['eu gostaria de marcar uma reunião', 'I’d like to schedule a meeting', 'me gustaría programar una reunión', 'vorrei fissare una riunione', 'je voudrais fixer une réunion', 'ich möchte einen Termin vereinbaren', '会議を設定したいです', '회의를 잡고 싶어요', '我想安排一个会议'],
        ['vou te mandar um e-mail', 'I’ll send you an email', 'te enviaré un correo', 'ti mando un’email', 'je t’envoie un e-mail', 'ich schicke dir eine E-Mail', 'メールを送ります', '이메일 보낼게요', '我给你发邮件'],
        ['prazo', 'deadline', 'plazo', 'scadenza', 'date limite', 'Frist', '締め切り', '마감', '截止日期'],
        ['vamos alinhar os detalhes', 'let’s go over the details', 'repasemos los detalles', 'vediamo i dettagli', 'faisons le point sur les détails', 'lass uns die Details abstimmen', '詳細を確認しましょう', '세부 사항을 맞춰 봐요', '我们来对一下细节'],
        ['estou disponível', 'I’m available', 'estoy disponible', 'sono disponibile', 'je suis disponible', 'ich bin verfügbar', '空いています', '시간 돼요', '我有空'],
      ],
    },
  ],

  B2: [
    {
      slug: 'argumentacao', title: 'Argumentação', skills: ['writing', 'speaking', 'reading'],
      grammar: 'Para argumentar, compare lados, acrescente ideias e faça ressalvas. São estas palavras que organizam um bom argumento.',
      items: [
        ['por um lado', 'on the one hand', 'por un lado', 'da un lato', 'd’un côté', 'einerseits', '一方では', '한편으로는', '一方面'],
        ['por outro lado', 'on the other hand', 'por otro lado', 'dall’altro lato', 'd’un autre côté', 'andererseits', '他方では', '다른 한편으로는', '另一方面'],
        ['além disso', 'furthermore', 'además', 'inoltre', 'de plus', 'außerdem', 'さらに', '게다가', '此外'],
        ['no entanto', 'however', 'sin embargo', 'tuttavia', 'cependant', 'jedoch', 'しかし', '하지만', '然而'],
        ['apesar de', 'despite', 'a pesar de', 'nonostante', 'malgré', 'trotz', 'にもかかわらず', '에도 불구하고', '尽管'],
      ],
    },
    {
      slug: 'expressoes', title: 'Expressões naturais', skills: ['vocabulário', 'listening', 'speaking'],
      grammar: 'Expressões do dia a dia raramente são traduzidas palavra por palavra. Aprenda o equivalente natural.',
      items: [
        ['não faz mal', 'never mind', 'no pasa nada', 'non fa niente', 'ce n’est pas grave', 'macht nichts', '大丈夫です', '괜찮아요', '没关系'],
        ['tanto faz', 'I don’t mind', 'me da igual', 'per me è uguale', 'ça m’est égal', 'ist mir egal', 'どちらでもいいです', '아무거나 괜찮아요', '都可以'],
        ['vale a pena', 'it’s worth it', 'vale la pena', 'ne vale la pena', 'ça vaut le coup', 'es lohnt sich', 'やる価値があります', '할 만한 가치가 있어요', '值得'],
        ['estou sem tempo', 'I’m short on time', 'no tengo tiempo', 'non ho tempo', 'je manque de temps', 'ich habe keine Zeit', '時間がありません', '시간이 없어요', '我没时间'],
        ['faz sentido', 'it makes sense', 'tiene sentido', 'ha senso', 'ça a du sens', 'das ergibt Sinn', '理にかなっています', '말이 되네요', '有道理'],
      ],
    },
    {
      slug: 'verbos', title: 'Verbos com nuance', skills: ['gramática', 'vocabulário'],
      grammar: 'Alguns verbos mudam de sentido com uma partícula ou preposição. Em inglês, são os phrasal verbs (give up, find out…).',
      items: [
        ['desistir', 'give up', 'rendirse', 'arrendersi', 'abandonner', 'aufgeben', '諦める', '포기하다', '放弃'],
        ['descobrir', 'find out', 'averiguar', 'scoprire', 'découvrir', 'herausfinden', '突き止める', '알아내다', '发现'],
        ['adiar', 'put off', 'posponer', 'rimandare', 'remettre à plus tard', 'aufschieben', '先延ばしにする', '미루다', '推迟'],
        ['lidar com', 'deal with', 'lidiar con', 'affrontare', 'gérer', 'umgehen mit', '対処する', '대처하다', '应对'],
        ['seguir em frente', 'move on', 'seguir adelante', 'andare avanti', 'passer à autre chose', 'weitermachen', '前に進む', '앞으로 나아가다', '向前看'],
      ],
    },
    {
      slug: 'negociacao', title: 'Negociação e reuniões', skills: ['speaking', 'writing', 'listening'],
      grammar: 'Em reuniões, você precisa destacar pontos, considerar fatores e chegar a acordos.',
      items: [
        ['proposta', 'proposal', 'propuesta', 'proposta', 'proposition', 'Vorschlag', '提案', '제안', '提议'],
        ['gostaria de destacar que', 'I’d like to point out that', 'quisiera destacar que', 'vorrei sottolineare che', 'j’aimerais souligner que', 'ich möchte betonen, dass', '強調したいのは', '강조하고 싶은 것은', '我想强调的是'],
        ['levando em conta', 'taking into account', 'teniendo en cuenta', 'tenendo conto di', 'compte tenu de', 'unter Berücksichtigung', 'を考慮すると', '을 고려하면', '考虑到'],
        ['chegar a um acordo', 'reach an agreement', 'llegar a un acuerdo', 'raggiungere un accordo', 'parvenir à un accord', 'eine Einigung erzielen', '合意に達する', '합의에 이르다', '达成协议'],
        ['resultados', 'results', 'resultados', 'risultati', 'résultats', 'Ergebnisse', '結果', '결과', '结果'],
      ],
    },
  ],

  C2: [
    {
      slug: 'registro', title: 'Registro e formalidade', skills: ['speaking', 'writing', 'reading'],
      grammar: 'No nível de domínio, o desafio é escolher o registro certo: a mesma ideia pode soar fria, educada ou íntima.',
      items: [
        ['poderia, por gentileza…', 'would you kindly…', '¿sería tan amable de…?', 'potrebbe gentilmente…', 'auriez-vous l’amabilité de…', 'wären Sie so freundlich…', '…していただけますでしょうか', '…해 주시겠습니까', '能否劳驾您……'],
        ['lamento informar que', 'I regret to inform you that', 'lamento informarle que', 'mi rincresce comunicarle che', 'j’ai le regret de vous informer que', 'ich bedauere, Ihnen mitteilen zu müssen, dass', '残念ながらお知らせいたします', '유감스럽게도 알려 드립니다', '很遗憾地通知您'],
        ['fique à vontade', 'feel free', 'con toda confianza', 'faccia pure', 'n’hésitez pas', 'zögern Sie nicht', 'ご遠慮なく', '편하게 하세요', '请随意'],
        ['com todo o respeito', 'with all due respect', 'con todo respeto', 'con tutto il rispetto', 'sauf votre respect', 'bei allem Respekt', '失礼ながら', '외람되지만', '恕我直言'],
        ['gostaria de salientar', 'I would like to emphasize', 'quisiera subrayar', 'vorrei evidenziare', 'je tiens à souligner', 'ich möchte hervorheben', '申し上げたいのは', '말씀드리고 싶은 것은', '我想指出'],
      ],
    },
    {
      slug: 'idiomaticas', title: 'Expressões idiomáticas', skills: ['vocabulário', 'listening', 'reading'],
      grammar: 'Cada idioma tem a sua imagem para a mesma ideia. Aqui você aprende o equivalente real, não a tradução literal.',
      items: [
        ['custar os olhos da cara', 'cost an arm and a leg', 'costar un ojo de la cara', 'costare un occhio della testa', 'coûter les yeux de la tête', 'ein Vermögen kosten', '目が飛び出るほど高い', '엄청 비싸다', '贵得要命'],
        ['matar dois coelhos com uma cajadada só', 'kill two birds with one stone', 'matar dos pájaros de un tiro', 'prendere due piccioni con una fava', 'faire d’une pierre deux coups', 'zwei Fliegen mit einer Klappe schlagen', '一石二鳥', '일석이조', '一举两得'],
        ['colocar os pingos nos is', 'dot the i’s and cross the t’s', 'poner los puntos sobre las íes', 'mettere i puntini sulle i', 'mettre les points sur les i', 'Klartext reden', 'はっきりさせる', '분명히 하다', '把话说清楚'],
        ['falar pelos cotovelos', 'talk someone’s ear off', 'hablar por los codos', 'parlare come una macchinetta', 'être bavard comme une pie', 'wie ein Wasserfall reden', 'よくしゃべる', '수다스럽다', '说个不停'],
        ['pisar em ovos', 'walk on eggshells', 'andar con pies de plomo', 'camminare sulle uova', 'marcher sur des œufs', 'wie auf Eierschalen laufen', '腫れ物に触るように', '살얼음을 걷다', '小心翼翼'],
      ],
    },
    {
      slug: 'sofisticado', title: 'Vocabulário sofisticado', skills: ['vocabulário', 'reading', 'writing'],
      grammar: 'Palavras precisas deixam o discurso elegante. Use-as em textos e falas formais.',
      items: [
        ['inevitável', 'inevitable', 'inevitable', 'inevitabile', 'inévitable', 'unvermeidlich', '避けられない', '불가피한', '不可避免的'],
        ['ambíguo', 'ambiguous', 'ambiguo', 'ambiguo', 'ambigu', 'mehrdeutig', '曖昧な', '모호한', '模棱两可的'],
        ['efêmero', 'ephemeral', 'efímero', 'effimero', 'éphémère', 'vergänglich', 'はかない', '덧없는', '短暂的'],
        ['meticuloso', 'meticulous', 'meticuloso', 'meticoloso', 'méticuleux', 'akribisch', '几帳面な', '꼼꼼한', '一丝不苟的'],
        ['pertinente', 'relevant', 'pertinente', 'pertinente', 'pertinent', 'relevant', '適切な', '적절한', '中肯的'],
      ],
    },
    {
      slug: 'nuances', title: 'Situações complexas', skills: ['speaking', 'listening', 'revisão'],
      grammar: 'Discordar com elegância, corrigir mal-entendidos e ponderar: é aqui que o domínio aparece.',
      items: [
        ['entendo seu ponto, mas discordo respeitosamente', 'I see your point, but I respectfully disagree', 'entiendo tu punto, pero discrepo respetuosamente', 'capisco il tuo punto di vista, ma non sono d’accordo', 'je comprends ton point de vue, mais je ne suis pas d’accord', 'ich verstehe deinen Standpunkt, sehe es aber anders', 'おっしゃることは分かりますが、賛成できません', '무슨 말씀인지 알겠지만, 정중히 반대합니다', '我理解你的观点，但恕我不能同意'],
        ['não foi bem isso que eu quis dizer', 'that’s not quite what I meant', 'no es exactamente lo que quise decir', 'non è proprio quello che intendevo', 'ce n’est pas tout à fait ce que je voulais dire', 'das habe ich so nicht gemeint', 'そういう意味ではありません', '제 말은 그런 뜻이 아니었어요', '我不是那个意思'],
        ['vamos pesar os prós e contras', 'let’s weigh the pros and cons', 'sopesemos los pros y los contras', 'valutiamo i pro e i contro', 'pesons le pour et le contre', 'wägen wir das Für und Wider ab', '長所と短所を比べてみましょう', '장단점을 따져 봅시다', '我们来权衡一下利弊'],
        ['isso levanta uma questão delicada', 'that raises a delicate issue', 'eso plantea una cuestión delicada', 'questo solleva una questione delicata', 'cela soulève une question délicate', 'das wirft eine heikle Frage auf', 'それは微妙な問題ですね', '그건 민감한 문제를 제기하네요', '这引出了一个微妙的问题'],
        ['nas entrelinhas', 'between the lines', 'entre líneas', 'tra le righe', 'entre les lignes', 'zwischen den Zeilen', '行間', '행간', '字里行间'],
      ],
    },
  ],
};

/**
 * Unidades próprias do japonês: escrita e partículas não são “tradução de frases”.
 * Cada item: [explicação em português, alvo, leitura]. `after` = slug da unidade
 * depois da qual ela entra. `ask` personaliza as perguntas.
 */
export const JAPANESE_EXTRA = {
  A1: [
    {
      after: null, slug: 'hiragana', title: 'Hiragana', skills: ['escrita', 'reading', 'listening'],
      grammar: 'O hiragana é o primeiro alfabeto do japonês: cada símbolo é uma sílaba. Ele é usado em palavras japonesas e partículas.',
      ask: { produce: 'Qual hiragana tem o som “{src}”?', reverse: 'Qual é o som de “{tgt}”?' },
      items: [['a', 'あ', 'a'], ['i', 'い', 'i'], ['u', 'う', 'u'], ['e', 'え', 'e'], ['o', 'お', 'o'], ['ka', 'か', 'ka'], ['sa', 'さ', 'sa'], ['ta', 'た', 'ta']],
    },
    {
      after: 'hiragana', slug: 'katakana', title: 'Katakana', skills: ['escrita', 'reading'],
      grammar: 'O katakana tem os mesmos sons do hiragana, mas é usado para palavras estrangeiras, como café e pão.',
      ask: { produce: 'Como se escreve “{src}” em katakana?', reverse: 'O que significa “{tgt}”?' },
      items: [['a (katakana)', 'ア', 'a'], ['ka (katakana)', 'カ', 'ka'], ['café', 'コーヒー', 'kōhī'], ['pão', 'パン', 'pan'], ['televisão', 'テレビ', 'terebi'], ['computador', 'パソコン', 'pasokon']],
    },
    {
      after: 'apresentacoes', slug: 'particulas', title: 'Partículas は・を・に・で・の・か', skills: ['gramática'],
      grammar: 'Partículas vêm depois da palavra e mostram a função dela na frase: tema, objeto, destino, lugar, posse ou pergunta.',
      ask: { produce: 'Qual partícula indica: {src}?', reverse: 'Para que serve a partícula “{tgt}”?' },
      items: [['o tema da frase', 'は', 'wa'], ['o objeto da ação', 'を', 'o'], ['destino ou horário', 'に', 'ni'], ['o lugar onde algo acontece', 'で', 'de'], ['posse (de)', 'の', 'no'], ['uma pergunta', 'か', 'ka']],
    },
  ],
  A2: [
    {
      after: null, slug: 'kanji', title: 'Kanji básicos', skills: ['escrita', 'vocabulário', 'reading'],
      grammar: 'Kanji são ideogramas: cada um tem significado e pode ter mais de uma leitura. Comece pelos mais comuns.',
      ask: { produce: 'Qual kanji significa “{src}”?', reverse: 'O que significa o kanji “{tgt}”?' },
      items: [['dia, sol', '日', 'hi / nichi'], ['lua, mês', '月', 'tsuki / getsu'], ['pessoa', '人', 'hito / jin'], ['montanha', '山', 'yama / san'], ['água', '水', 'mizu / sui'], ['estudo', '学', 'gaku']],
    },
  ],
  B1: [
    {
      after: null, slug: 'formalidade', title: 'Formalidade e keigo', skills: ['gramática', 'speaking'],
      grammar: 'Em japonês, a forma do verbo muda conforme a relação com a pessoa: casual, polida (です/ます), honorífica e humilde.',
      ask: { produce: 'Qual é a forma certa: {src}?', reverse: 'Que tipo de forma é “{tgt}”?' },
      items: [['comer (forma polida)', '食べます', 'tabemasu'], ['estar (honorífico, para o outro)', 'いらっしゃいます', 'irasshaimasu'], ['dizer (humilde, para si)', '申します', 'mōshimasu'], ['obrigado (formal)', 'ありがとうございます', 'arigatō gozaimasu'], ['sim (casual)', 'うん', 'un'], ['ser/estar (polido)', 'です', 'desu']],
    },
  ],
};
