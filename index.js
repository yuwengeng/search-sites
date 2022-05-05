const jsdom = require("jsdom");
const fs=require('fs');
const axios = require("axios")



function renderHTML(document,resolve){
    String.prototype.interpolate = function (params,type) {
        const names = Object.keys(params);
        const vals = Object.values(params);
        let n_vals = vals[0].filter( function(obj){
            return obj["type"]==type;
        })
        return new Function(...names, `return \`${this}\`;`)(...[n_vals]);
    };

    let strTemplate = document.querySelector('template').innerHTML;

  axios.get('https://crud.ywg.workers.dev/get?key=searchData').then(res=>{
          const json = res.data;
          const setWrapper = new Set();
          const y = json.data

            y.forEach(i=> {
                if(setWrapper.has(i.type)) return;
                setWrapper.add(i.type)
                });
          
          console.log('setWrapper',setWrapper)
          const oFragmeng = document.createDocumentFragment(); 

          setWrapper.forEach(i=>{
            const op = document.createElement("div");
            op.className  = i;
            op.innerHTML = strTemplate.interpolate(json,i);
            oFragmeng.appendChild(op); 
          })
        document.querySelector('.items').appendChild(oFragmeng);  
        // console.log('ai',document.querySelector('.ai').textContent,ops_ai)
        let html = document.querySelector("html").outerHTML;
         resolve(html)
  });
  // return html
}

fs.readFile('./tpl.html','utf8',function(err,data){
    if(err){
        console.log('err');
    }
    const {
        JSDOM
    } = jsdom;
     
    const dom = new JSDOM(data)
     
    const document = dom.window.document;
    new Promise((resolve, reject)=> renderHTML(document,resolve)).then((html)=>{
            fs.writeFile('./index.html',html,{encoding:'utf8',flag:'w'},function(err){
                if(err)
                    console.log('写文件出错了，错误是：'+err);
                else
                    console.log('ok');
                }) 
    }).catch(()=>{
        console.log('err')
    })
    
})

 
