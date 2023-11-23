const XLSX = require('xlsx')

class XLSTOOL {

  async grabXLSSettings() {
    return {
      GRI: {
        Standards: [
          {
            "ident": { title: 'ident' },
            "superior_element": { title: 'superior_element', in: 'gri' },
            "position": { title: 'position', in: 'gri' },
            "title": { title: 'title', in: 'gri' },
            "description": { title: 'description', in: 'gri' },
            "remark": { title: 'remark', in: 'gri' },
            "definition": { title: 'definition', in: 'gri' },
            "formular": { title: 'formular', in: 'gri' },
            "units": { title: 'units', in: 'gri' },
            "selection": { title: 'selection', in: 'gri' },
            "constant": { title: 'constant', in: 'gri' },
            "cost active": { title: 'cost active', in: 'gri' },
            "cost mandatory": { title: 'cost mandatory', in: 'gri' },
            "indicator mandatory": { title: 'indicator mandatory', EMPTY: true },
            "indicator groups": { title: 'indicator groups', in: 'gri' },
            "norm requirement - norm": { title: 'norm requirement - norm', EMPTY: true },
            "norm requirement - chapter number": { title: 'norm requirement - chapter number', EMPTY: true },
            "norm requirement - chapter name": { title: 'norm requirement - chapter name', EMPTY: true },
            "document ID": { title: 'document ID', in: 'gri' },
            //"sort": { title: 'sort' }
          }
        ]
      },
      CATALOG: {
        Catalogs: [
          {
            "Title Catalog": { title: 'catalog' },
            "scope": { title: 'scope' },
            "Position": { title: 'position' },
            "Task": { title: 'task', selection: true },
          }
        ],
        Indicators: [
          {
            "Title Catalog": { title: 'catalog' },
            "Indicator Title": { title: 'title', in: 'gri' },
            "Indicator Property": { title: 'ident' },
            "start_date": { title: 'start_date', selection: true },
            "interval": { title: 'interval', selection: true },
          }
        ]
      },
      COMPARE: {
        compare: [
          {
            "ident": { title: 'ident' },
            "titleNEW": { title: 'titleNEW' },
            "titleOLD": { title: 'titleOLD' },
            "titleDIFF": { title: 'titleDIFF' }
          }
        ],
        outdated: [
          {
            "ident": { title: 'property' },
            "title": { title: 'titel' },
          }
        ]
      },
      TRANSLATIONS: {
        compare: [
          {
            "ident": { title: 'ident' },
            "EN": { title: 'EN' },
            "DE": { title: 'DE' },
          }
        ],
      },
    }
  }

  async PREPARE_JSON_GRI_COMPARE(input) {
    try {
      const jsonData = input.JSONDATA
      const template = input.IMPORTTEMPLATE
      const tab = input.TAB
      return await new Promise((resolve, reject) => {
        const filled = {}
        filled[tab] = []
        for (const i in jsonData) { // ROWS FOR CATALOGS
          const datalayer = {}
          let tie = ''
          let content = ''
          let storage = []
          let proceed = true
          for (const ti of Object.keys(template[tab][0])) {
            const tabData = template[tab][0][ti]
            tie = tabData.title
            content = jsonData[i][tie]
            datalayer[ti] = content
          }
          if (proceed === true) {
            storage = []
            storage = filled[tab]
            storage.push(datalayer)
            filled[tab] = storage
          }
        }
        resolve(filled[tab])
      })
    } catch (err) {
      console.log(err)
      return 'input'
    }
  }  
  
  async prepareJSONCatalog(input) {
    try {
    const { jsonData, additions, tab } = input
    const settings = await this.grabXLSSettings()
    const template = settings.CATALOG

      return await new Promise((resolve, reject) => {
        const filled = {}
        filled[tab] = []
        for (const i in jsonData) { // ROWS FOR CATALOGS
            const datalayer = {}
            let tie = ''
            let content = ''
            let storage = []
            let proceed = true
            for (const ti of Object.keys(template[tab][0])) {
              const tabData = template[tab][0][ti]
              tie = tabData.title
              if (!tabData.EMTPY) {
                content = jsonData[i][tie]
                if (tabData.selection){          
                  if (additions[tie][jsonData[i].catalog.default]) content = additions[tie][jsonData[i].catalog.default]
                  else content = additions[tie].default
                }
                if (typeof content === 'object' && content !== null && Object.keys(content)[0]) content = content[Object.keys(content)[0]]
                if (tabData['in']) content = jsonData[i][tabData.in][tie]
                datalayer[ti] = content
                if (jsonData[i][tie] === 'EMPTY') proceed = false
              }
            }
            if (proceed === true) {
            storage = []
            storage = filled[tab]
            storage.push(datalayer)
            filled[tab] = storage
            }
          }
        resolve(filled[tab].sort(GetSortOrder('Title Catalog')))
      })
    } catch (err) {
      console.log(err)
      return 'input'
    }
  }

  async prepareJSONGRI (input) {
    try {
      const { jsonData } = input
      const settings = await this.grabXLSSettings()
      const template = settings.GRI
      return await new Promise((resolve, reject) => {
        const filled = {}
        let tab = ''
        let storage = {}
        let datalayer = {}
        for (const i in jsonData) { // ROWS
        if (tab !== jsonData[i].tab){//NEWTAB
        tab = jsonData[i].tab
        storage[tab] = []
        }
        let tie = ''
        let content = ''
          for (const ti of Object.keys(template['Standards'][0])) {
            tie = template['Standards'][0][ti]
            if (!tie.EMTPY){
            let data = jsonData[i]

            if (tie['in']) {
              data = jsonData[i][tie.in]
             // if (jsonData[i][tie.in].ident === 'i306_20_4') console.log(jsonData[i][tie.in].title)
            }
              content = data[tie['title']]
              datalayer[tie.title] = content ? content : ''
          }
        }
          storage[tab].push(datalayer)
          datalayer = {}
      } 
        resolve(storage)
      })
    } catch (err) {
      console.log(err)
      return 'input'
    }
  }

  async JSONTOSHEET (jsonData) {
    try {
      return await new Promise((resolve, reject) => {
        const sheet = XLSX.utils.json_to_sheet(jsonData)
        if (!sheet) reject(sheet)
        resolve(sheet)
      })
    } catch (err) { return err }
  }

  async WORKBOOK () {
    try {
      return await new Promise((resolve, reject) => {
        const workBook = XLSX.utils.book_new()
        if (!workBook) reject(workBook)
        resolve(workBook)
      })
    } catch (err) { return err }
  }

  async APPENDSHEET (c, input) {
    try {
      return await new Promise((resolve, reject) => {
        const appendSheet = XLSX.utils.book_append_sheet(input.workbook, input.to_sheet[c], input.sheets[c])
        if (!appendSheet) reject(appendSheet)
        input.appendSheet = appendSheet
        resolve(input)
      })
    } catch (err) { return err }
  }

  async CREATEFILE(workbook, filename_in) {
    try {
      return await new Promise((resolve, reject) => {
        const filename = filename_in + OutputISOTime(TIMENOW())+'.xlsx'
        console.log('FiLE: '+filename)
        const resp = XLSX.writeFile(workbook, process.env.IMPORTFILESPATH + '/' + filename, { compression: true })
        resolve(resp)
      })
    } catch (err) { return err }
  }
}

const TIMENOW = () => {
  let offset = new Date().getTimezoneOffset();
  const sign = offset < 0 ? '+' : '-';
  offset = Math.abs(offset);
  const minutes = offset % 60;
  const hours = (offset - minutes) / 60;
  const timezone = `${sign}${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`
  return new Date(new Date().getTime() + offset * 60 * 1000).toISOString().replace("Z", timezone)
}

OutputISOTime = (ISOSTRING) => {
  const date = new Date(ISOSTRING)
  const dateOptions = { day: '2-digit', month: '2-digit', year: 'numeric' }
  const timeOptions = { hour: '2-digit', minute: '2-digit', second: '2-digit' }
  let d = date.toLocaleDateString('de-DE', dateOptions) + '_' + date.toLocaleTimeString('de-DE', timeOptions)
  d = d.replaceAll('.','_').replaceAll(':','_')
  return d
} 


const GetSortOrder = (prop, reverse) => (a, b) => {
  if (reverse) {
    return (a[prop] > b[prop]) ? -1 : (b[prop] > a[prop] ? 1 : 0)
  } else {
    return (a[prop] > b[prop]) ? 1 : (b[prop] > a[prop] ? -1 : 0)
  }
}

module.exports = XLSTOOL
