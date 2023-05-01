function searchByAlgolia() {
    // 将search input 转移到隐藏的algolia input上，这样还可以用search input 的样式
    let searchInput = document.getElementById("search-input");
    let aisInput = document.getElementsByClassName("ais-SearchBox-input")[0];
    aisInput.value = searchInput.value;
    let changeEvent = document.createEvent("Event");
    changeEvent.initEvent("change", true, true);
    aisInput.dispatchEvent(changeEvent);
    let inputEvent = document.createEvent("Event");
    inputEvent.initEvent("input", true, true);
    aisInput.dispatchEvent(inputEvent);
}


let search = instantsearch({
    indexName: 'wiki',
    searchClient: algoliasearch(
        'GB90MXPJ1C',
        '05d808da3baf50ac2f2fad2dc3a3cd8f'
    ),
    searchFunction: helper => {
        if (helper.state.query) {
            helper.search();
        }
    },
});

// Add widgets
// ...
window.pjax && search.on('render', () => {
    window.pjax.refresh(document.getElementById('algolia-hits'));
});

let searchBox = instantsearch.widgets.searchBox({
    container: '#alg-search-input',
    placeholder: "Search",
    showReset: false,
    showSubmit: false,
    wrapInput: false,
});
// Create the render function
const renderHits = (renderOptions, isFirstRender) => {
    const {hits, widgetParams} = renderOptions;
    widgetParams.container.innerHTML = `
    <ol class="md-search-result__list">
      ${hits.map(
            item => {
                let title=item._highlightResult.title.value;
                let content=item._highlightResult.content.value;
                return `<li class="md-search-result__item">
                      <a href="${item.url}" class="md-search-result__link" tabindex="-1">
                      <article class="md-search-result__article md-search-result__article--document" data-md-score="11.50">
                      <div class="md-search-result__icon md-icon"></div>
                      <h1 class="md-search-result__title">${title}</h1>
                      <p class="md-search-result__teaser">${content}</p></article></a>                  
                 </li>`
            }
        )
        .join('')}
    </ol>
  `;
};
const customHits = instantsearch.connectors.connectHits(renderHits);
let customHitsWidget = customHits({
    container: document.querySelector('#algolia-hits'),
});
let hitsWidget = instantsearch.widgets.hits({
    container: '#algolia-hits',
// hitsPerPage: 20,
    templates: {
        allItems: data => {
            console.log(data)
//             let link = data.url;
//             let title = data.title;
//             let body = data.content;
//
//             let item = `<a href="${link}" class="md-search-result__link">
// <article class="md-search-result__article md-search-result__article--document">
// <div class="md-search-result__icon md-icon"/>
// <h1 class="md-search-result__title">${title}</h1>
// <p class="md-search-result__teaser">${body}</p></article>
// </a>`;
//             return `<a href="${link}" class="md-search-result__link">
// <article class="md-search-result__article md-search-result__article--document">
// <div class="md-search-result__icon md-icon"/>
// ${title}
// </div>
// </article>
// </a>
// <a href="${link}"><p>${body}<p></a>`;
        },
        empty: data => {
            return "";
        }
    },
    cssClasses: {
        item: 'md-search-result__item',
    },
});

let stats = instantsearch.widgets.stats({
    container: '#algolia-stats',
    templates: {
        text: data => {
            return `${data.nbHits} result found in ${data.processingTimeMS} seconds
            <span class="algolia-powered" style="float:right">
              <img src="https://res.cloudinary.com/hilnmyskv/image/upload/v1461180091/search-by-algolia.svg" alt="Algolia"  height="18px" style="margin: 0px 0px -4px 0px;">
            </span>`;
        }
    }
});
search.addWidgets([searchBox, customHitsWidget, stats]);
search.start();
