'use strict'

module.exports.register = function () {
  this.once('contentClassified', ({ contentCatalog }) => {
    const newPage = contentCatalog.addFile({
      contents: Buffer.from('= New Page\n\nThis is the contents of a generated page.'),
      path: 'modules/ROOT/pages/new-page.adoc',
      src: {
        path: 'modules/ROOT/pages/new-page.adoc',
        component: 'antora',
        version: '3.0',
        module: 'ROOT',
        family: 'page',
        relative: 'new-page.adoc',
      },
    })
  })
}
