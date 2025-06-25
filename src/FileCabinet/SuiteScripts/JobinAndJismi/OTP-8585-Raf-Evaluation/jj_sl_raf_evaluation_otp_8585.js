/**
 * @NApiVersion 2.1
 * @NScriptType Suitelet
 */
/************************************************************************************************
***************
* 
*
*
*
${OTP-8585}:{Product Data Fetch & Display from External API}
*
*
**************************************************************************************************
*
*Author:Jobin and Jismi IT Services
*
*Date Created:25-June-2025
*
*This script is for creating a custom form where te users can search for products and the product
* details and customer reviews of the product gets displayed  in the form. Product data is fetched 
*from an external API.
*
** REVISION HISTORY
*
* @version 1.0 25-June-2025 : Created the initial build by JJ0403

*************************************************************************************************
***********************/
/**
 * @NApiVersion 2.1
 * @NScriptType Suitelet
 */
define(['N/record',"N/ui/serverWidget","N/https",'N/log'],
    /**
 * @param{log} log
 * @param{record} record
 */
    (record,serverWidget,https,log) => {
        /**
         * Defines the Suitelet script trigger point.
         * @param {Object} scriptContext
         * @param {ServerRequest} scriptContext.request - Incoming request
         * @param {ServerResponse} scriptContext.response - Suitelet response
         * @since 2015.2
         */
        const onRequest = (scriptContext) => {
            try{
                if(scriptContext.request.method === "GET"){
                    fetchdata(scriptContext)
                }
            }catch(error){
                log.error('unexpected error',error)
            }
            if(scriptContext.request.method === "POST"){
                try{
                let ProductDetials = retriveDetials(scriptContext)
                let latestData = JSON.parse(ProductDetials.body);
                let latestdetials = latestData.products;

                }catch(error){
                log.error('unexpected error',error)
                }

                setFields(scriptContext)
            }
        /**
         * Defines the Suitelet script trigger point.
         * @param {Object} scriptContext
         * @since 2015.2
         */
             function fetchdata(scriptContext) {
                try {
            
                    let Productform = serverWidget.createForm({
                    title: "Product Data",
                    });
            
                    let productFilter = Productform.addField({
                    id: "custpage_product",
                    type: serverWidget.FieldType.TEXT,
                    label: "Product SKU",
                    });
                    Productform.addSubmitButton({ label: "Fetch Reviews" });
                    scriptContext.response.writePage({
                    pageObject: Productform,
                    });
                }catch(error){
                log.error('unexpected error',error)
                }
            }

        /**
         * Defines the Suitelet script trigger point.
         * @param {Object} scriptContext
         * @returns {ProductDetials}
         * @since 2015.2
         */
            function retriveDetials(scriptContext){
                try{
                    let apiLink =
                    "https://dummyjson.com/products";

                    let ProductDetials = https.get({
                    url: apiLink,
                    headers: "application/json",
                    });
                    return ProductDetials;
                }catch(error){
                    log.error('unexpected error',error)
                }
            }

        /**
         * Defines the Suitelet script trigger point.
         * @param {Object} scriptContext
         * @since 2015.2
         */
            function setFields(scriptContext){
                try{
                    let productSKU = scriptContext.request.parameters.custpage_product;
                    let refsku = productSKU.toString();
                    let slicedSKU=refsku.slice(13,15)
                    let key = slicedSKU < 10 ? refsku.slice(14,15):refsku.slice(13,15)
                    let newURL = `https://dummyjson.com/products/${key}`
                    let newProductDetials = https.get({
                    url: newURL,
                    headers: "application/json",
                    });
                    let parsedDetails = JSON.parse(newProductDetials.body);
                    let title = parsedDetails.title;
                    let cate = parsedDetails.category;
                    let descipt = parsedDetails.description;
                    let price = parsedDetails.price;
                    let ProductListform = serverWidget.createForm({
                        title: "Product Details",
                        });
                
                    let productFilter = ProductListform.addField({
                        id: "custpage_product_sku",
                        type: serverWidget.FieldType.TEXT,
                        label: "Product SKU",
                    }).defaultValue=productSKU;

                    let ProductName = ProductListform.addField({
                        id: "custpage_product_name",
                        type: serverWidget.FieldType.TEXT,
                        label: "Product Name",
                    }).defaultValue=title;

                    let productCategory = ProductListform.addField({
                        id: "custpage_product_category",
                        type: serverWidget.FieldType.TEXT,
                        label: "Product Category",
                    }).defaultValue=cate;
                    let productPrice = ProductListform.addField({
                        id: "custpage_product_price",
                        type: serverWidget.FieldType.TEXT,
                        label: "Product Price",
                    }).defaultValue=price;
                        let productDescription = ProductListform.addField({
                        id: "custpage_product_description",
                        type: serverWidget.FieldType.TEXT,
                        label: "Product Description",
                    }).defaultValue=descipt;
                        let sublist = ProductListform.addSublist({
                        id : 'custpage_sublistid',
                        type : serverWidget.SublistType.INLINEEDITOR,
                        label : 'Review'
                    });
                    sublist.addField({
                        id:'custpage_review',
                        type: serverWidget.FieldType.TEXT,
                        label : 'Reviewer Name'
                    })
                    sublist.addField({
                        id:'custpage_rating',
                        type: serverWidget.FieldType.TEXT,
                        label : 'Rating'
                    })
                    sublist.addField({
                        id:'custpage_comment',
                        type: serverWidget.FieldType.TEXT,
                        label : 'Comment'
                    })
                    sublist.addField({
                        id:'custpage_review_date',
                        type: serverWidget.FieldType.TEXT,
                        label : 'Review Date'
                    })
                    let array = parsedDetails.reviews
                    for (var i=0;i<array.length;++i){
                        let name = array[i].reviewerName
                        let rating = array[i].rating
                        let comment = array[i].comment
                        let date = array[i].date

                        sublist.setSublistValue({
                            id: 'custpage_review',
                            line: i,
                            value: name
                        });
                        
                        sublist.setSublistValue({
                        id: "custpage_rating",
                        line: i,
                        value: rating,
                        });
                        sublist.setSublistValue({
                        id: "custpage_comment",
                        line: i,
                        value: comment,
                        });
                        sublist.setSublistValue({
                        id: "custpage_review_date",
                        line: i,
                        value: date,
                        });
                }

                scriptContext.response.writePage({
                    pageObject: ProductListform,
                });
                }catch(error){
                    log.error('unexpected error',error)
                }
            }

                
        }
        return {onRequest}

    });
