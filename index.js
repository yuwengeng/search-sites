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
          let ops_all = strTemplate.interpolate(json,'all');
        let ops_pans =  strTemplate.interpolate(json,'pans');
        let ops_jike = strTemplate.interpolate(json,'jike')
        let ops_bt = strTemplate.interpolate(json,'bt')
        let ops_life = strTemplate.interpolate(json,'life')
        let ops_index = strTemplate.interpolate(json,'index')
        let ops_ai = strTemplate.interpolate(json,'ai')

        document.querySelector('.all').innerHTML = ops_all;
        document.querySelector('.pans').innerHTML = ops_pans
        document.querySelector('.jike').innerHTML = ops_jike
        document.querySelector('.bt').innerHTML = ops_bt
        document.querySelector('.life').innerHTML = ops_life;   
        document.querySelector('.index').innerHTML = ops_index;
        document.querySelector('.ai').innerHTML = ops_ai;  
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

 
