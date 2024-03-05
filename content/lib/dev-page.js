'use strict'

module.exports.register = function () {
  this.once('contentClassified', ({ playbook, contentCatalog }) => {
    console.log('site-wide attributes (as defined in playbook)')
    console.log(playbook.asciidoc.attributes)
    let fileContents = "== Site Wide Attributes\n\n"
    fileContents += `${playbook.asciidoc.attributes || {}}\n`
    contentCatalog.getComponents().forEach((component) => {
      component.versions.forEach((componentVersion) => {
        getUniqueOrigins(contentCatalog, componentVersion).forEach((origin) => {
          console.log(`${componentVersion.version}@${componentVersion.name} attributes (as defined in antora.yml)`)
          console.log(origin.descriptor.asciidoc?.attributes || {})
          fileContents += `== Component Wide Attributes\n\n${componentVersion.version}@${componentVersion.name}\n\n`
          fileContents += `[source,json]\n----\n`
          fileContents += JSON.stringify(origin.descriptor.asciidoc?.attributes || {}, null, 2)
          fileContents += `\n----\n`
        })
      })
    })
    const newPage = contentCatalog.addFile({
      contents: Buffer.from('= Dev Page\n\nTo disable this page, comment out the dev-page.js extenion in the playbook (usually defalt-site.yml)\n\n' + fileContents),
      path: 'modules/ROOT/pages/dev-page.adoc',
      src: {
        path: 'modules/ROOT/pages/dev-page.adoc',
        component: 'modules',
        version: 'master',
        module: 'ROOT',
        family: 'page',
        relative: 'dev-page.adoc',
      },
    })

  })
}

function getUniqueOrigins (contentCatalog, componentVersion) {
  return contentCatalog.findBy({ component: componentVersion.name, version: componentVersion.version })
    .reduce((origins, file) => {
      const origin = file.src.origin
      if (origin && !origins.includes(origin)) origins.push(origin)
      return origins
    }, [])
}
