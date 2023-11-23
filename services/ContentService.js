const DBOPERATIONS = require('../database/DBOperations'); const _DB = new DBOPERATIONS();
const XLSTOOL = require('./xlsService');
const XLS = new XLSTOOL()

const CustomError = require('../types/customError')

module.exports = class {

    grab = async (requestInput) => {
        console.log(requestInput)
        const { body } = requestInput
        const { content } = body
        switch (content) {
            case 'gri': //indicators
                return await this.buildGRICatalogs(body)
                //return await this.buildGRIndicators(body)
            default:
                //later
                break;
        }
    }

    buildGRICatalogs = async (params) => {
        const customer = params.customer
        const catalog = customer
        const standards = params.standards
        const match = {
            $and: [
                {
                    $or: [
                        { ['gri.title.default']: { $exists: true } },
                        { [`gri.title.${customer}`]: { $exists: true } }
                    ]
                },
                { "tab": { $in: standards } },
                { [`gri.definition.${customer}`]: { $ne: 'Calculation' } },
                { ['gri.definition.default']: { $ne: 'Calculation' } },
                { 'catalog': { $exists: true } }
            ]
        }
        const allIndicators = await _DB.findGRIContent({
            match,
            //sortby: { catalog: 1, sort: 1 },
            projects: {
                _id: 1,
                ident: 1,
                sort: 1,
                catalog: 1,
                tab: 1,
                gri: 1
            }
        })
        const catalogtoUnique = await this.reduceCatalogtoUnique({ allIndicators, catalog })
        const jsonData =  await this.addMultipleScopePos({ catalogtoUnique, catalog })
        const JSONXLSBODY = {} //BUILD TAB CATALOG
        let tab = 'Catalogs'
        const additions = { 
            interval: { default: 'year' }, 
            start_date: { default: '2023-10-01' }, 
            task: { default: 'recording' } 
        }

        JSONXLSBODY[tab] = await XLS.prepareJSONCatalog({ tab, jsonData, additions })
        console.log(JSONXLSBODY)
        return { JSONXLSBODY }
    }

    reduceCatalogtoUnique = async (input) => {
        const { allIndicators, catalog } = input
        const uniqueScopes = new Set();
        return allIndicators.reduce((acc, cur) => {
            let curCatalog = cur.catalog[catalog] ? cur.catalog[catalog] : cur.catalog.default
            if (!uniqueScopes.has(curCatalog)) {
                uniqueScopes.add(curCatalog)
                acc.push(cur);
            }
            return acc;
        }, [])
    }

    addMultipleScopePos = async (input) => {
        const { catalogtoUnique, catalog } = input
        const SELECTION = { scope: { default: [1] }, position: { default: [76] } }
        return catalogtoUnique.flatMap(obj => {
            let specifiCatalog = obj.catalog[catalog] ? obj.catalog[catalog] : obj.catalog.default
            let scopeValues = SELECTION.scope[specifiCatalog] ? SELECTION.scope[specifiCatalog] : SELECTION.scope.default
            let posValues = SELECTION.position[specifiCatalog] ? SELECTION.position[specifiCatalog] : SELECTION.position.default
            return scopeValues.map(val1 => {
                return posValues.map(val2 => {
                    return { ...obj, scope: val1, position: val2 }
                });
            });
        }).flat()
    }

    buildGRIndicators = async (params) => {
        //const { params } = requestInput

        const customer = params.customer
        const standards = params.standards
        const ands = [];
        standards.map(tabValue => { ands.push({ 'tab': tabValue }) });
        const ors = [{ [`gri.title.${customer}`]: { $exists: true } }]
        if (customer !== 'default') ors.push({ 'gri.title.default': { $exists: true } })

        const match = {
            $or: ors,
            $and: [{ $or: ands }]
        };

//        console.log(JSON.stringify(match))
        const allIndicators = await _DB.findGRIContent({
            match,
            projects: {
                _id: 0,
                title: 1,
                sort: 1,
                ident: 1,
                tab: 1,
                gri: 1
            }
        })
        console.log(allIndicators)
        const jsonData = await this.grabSpecificTitle(allIndicators)
        // console.log(jsonData)
        // console.log(allIndicators.length + ' indicators total')
        // console.log(reducedIndicators.length + ' indicators for customer ' + customer + ' standard')
        // console.log(jsonData.length + ' indicators (NOT EMPTY) for customer ' + customer + ' standard')
        const JSONXLSBODY = await XLS.prepareJSONGRI({ jsonData })
        return { JSONXLSBODY }
    }

/** Extracts specific properties from reduced indicators and customizes the title based on customer and language.
 * @param {Array} reducedIndicators - Array of reduced indicator objects.
 * @returns {Promise<Array>} - Array of filtered and customized indicator objects.
*/ 
grabSpecificTitle = async (reducedIndicators) => {
        /** Properties to be replaced and customized for title.
         * @type {Array<string>} */  const replacer = ['title', 'description', 'remark', 'definition', 'units', 'formular'];
        /** Default customer to use for title customization.
         * @type {string} */ const customer = "default";
        /** Language code for title customization.
         * @type {string} */ const lang = 'en';
        /** Filtered and customized indicator objects.
         * @type {Array} */
        return reducedIndicators.reduce((a, v) => {
            for (let r in replacer) {
                const rep = replacer[r];
                if (v.gri[rep]) {
                    const title = v.gri[rep];
                    const titleContent = title[customer] ? title[customer] : title.default;
                    if (['title', 'description', 'remark'].includes(rep)) {
                        v.gri[rep] = titleContent[lang] ? titleContent[lang] : titleContent['EN'];
                    } else {
                        v.gri[rep] = titleContent;
                    }
                }
            }
            if (v.gri.title !== 'EMPTY') {
                a.push(v);
            }
            return a;
        }, []);
    };

// /** Filters an array of indicators based on customer standards by API.
//  * @param {Array} allIndicators - Array of indicator objects to be filtered.
//  * @returns {Promise<Array>} - A promise that resolves with an array containing filtered indicator objects.
//  * @example
//  * const allIndicators = [...] // Array of indicator objects
//  * const filteredIndicators = await reduceToCustomerStandards(allIndicators);
//  */
//     reduceToCustomerStandards = async (allIndicators) => {
//         return allIndicators.reduce((a, v) => {
//             if (customerStandardsByAPI.includes(v.tab)) {//take a few Standards for now
//                 a = [...a, v]
//             }
//             return a
//         }, [])
//     }
}

const GRI_STANDARDS = [//2022_23
    "2 General Disclosures",
    "201 Economic Performance",
    "202 Market Presence",
    "203 Indirect Economic Impact",
    "204 Procurement Practices",
    "205 Anti-corruption",
    "206 Anti-competitive Behavior",
    "207 Tax",
    "3 Material Topics",
    "301 Materials",
    "302 Energy",
    "303 Water and Effluents",
    "304 Biodiversity",
    "305 Emissions",
    "306 Waste",
    "308 Supplier Env. Assessment",
    "401 Employment",
    "402 Labor Management Relations",
    "403 OHS",
    "404 Training and Education",
    "405 Diversity&Equal Opportunity",
    "406 Non-discrimination",
    "407 Freedom of Association",
    "408 Child Labor",
    "409 Forced or Compulsory Labor",
    "410 Security Practices",
    "411 Rights of Indigenous People",
    "413 Local Communities",
    "414 Supplier Social Assessment",
    "415 Public Policy",
    "416 Customer H&S",
    "417 Marketing and Labeling",
    "418 Customer Privacy"
]