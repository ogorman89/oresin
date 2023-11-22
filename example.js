const url = 'https://public.tableau.com/views/COVID-19CasesandDeathsinthePhilippines_15866705872710/Home?';
const params = new URLSearchParams({ 
    ":embed": "y",
    ":showVizHome": "no",
    ":display_count": "y",
    ":display_static_image": "y",
    ":bootstrapWhenNotified": true,
    ":language": "en",
    ":embed": "y",
    ":showVizHome": "n",
    ":apiID": "host0" 
});

(async () => {
    const site = await fetch(url + params);
    var text = await site.text();
    const $ = cheerio.load(text);
    const tsConfigJson = JSON.parse($('#tsConfigContainer').text());

    const body = new URLSearchParams();
    body.append('sheet_id', tsConfigJson.sheetId);

    const tableauData = await fetch(`https://public.tableau.com${tsConfigJson.vizql_root}/bootstrapSession/sessions/${tsConfigJson.sessionid}`, {
        method: 'POST',
        body: body
    })
    text = await tableauData.text();
    var jsonRegex = /\d+;({.*})\d+;({.*})/g;
    var match = jsonRegex.exec(text);
    const info = JSON.parse(match[1]);
    const data = JSON.parse(match[2]);
    console.log(data.secondaryInfo.presModelMap.dataDictionary.presModelHolder.genDataDictionaryPresModel.dataSegments["0"].dataColumns)
})();