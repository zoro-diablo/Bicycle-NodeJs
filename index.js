
const http = require('http');
const url = require('url');
const fs = require('fs').promises;
const bicycles = require('./data/data.json');
 

const server = http.createServer(async(req,res) => {
     if(req.url === '/favicon.ico') return;

     

     const myUrl = new URL(req.url,`http://${req.headers.host}/`);
     const pathname = myUrl.pathname;
     const id = myUrl.searchParams.get('id');
     console.log(req.url);
     if(pathname === '/'){
     
          let html = await fs.readFile('./view/bicycles.html', 'utf-8');

          const AllMainBicycles = await fs.readFile('./view/main/bmain.html', 'utf-8');

          let allTheBicycles = '';
          for (let index = 0; index < 6; index++){
               allTheBicycles += resplaceTemplate(AllMainBicycles,bicycles[index]);
          }
          html = html.replace(/<%AllMainBicycles%>/g, allTheBicycles);
 
          res.writeHead(200, {'Content-Type': 'text/html'});
          res.end(html);


     }else if(pathname === '/bicycle' && id >= 0 && id <= 5){

          let html = await fs.readFile('./view/overview.html', 'utf-8');

          const bicycle = bicycles.find((b) => b.id === id);
          
          html = resplaceTemplate(html,bicycle);

          res.writeHead(200, {'Content-Type': 'text/html'});
          res.end(html);

     } 
     else if(/\.(png)$/i.test(req.url)){
          const image = await fs.readFile(`./public/image/${req.url.slice(1)}`);
          res.writeHead(200, {'Content-Type': 'image/png'});
          res.end(image);
     }  

     else if(/\.(css)$/i.test(req.url)){
          const css = await fs.readFile(`./public/css/index.css`);
          res.writeHead(200, {'Content-Type': 'text/css'});
          res.end(css);
     } 

     else if(/\.(svg)$/i.test(req.url)){
          const svg = await fs.readFile(`./public/image/icons.svg`);
          res.writeHead(200, {'Content-Type': 'image/svg+xml'});
          res.end(svg);
     } 
     
     else{
          res.writeHead(404, {'Content-Type': 'text/html'});
          res.end('<div> <h1> File Not Found </h1> </div>');

     }

     
});

server.listen(3000);

function resplaceTemplate(html,bicycle){
     html = html.replace(/<%IMAGE%>/g, bicycle.image);
          html = html.replace(/<%NAME%>/g, bicycle.name);

          let price = bicycle.originalPrice;
          if(bicycle.hasDiscount){
               price = (price *(100 - bicycle.discount)) / 100;
          }
          html = html.replace(/<%NEWPRICE%>/g, `$${price}.00`);
          html = html.replace(/<%OLDPRICE%>/g, `$${bicycle.originalPrice}`);
          html = html.replace(/<%ID%>/g, bicycle.id);

          if(bicycle.hasDiscount){
               html = html.replace(/<%DISCOUNTRATE%>/g, `<div class="discount__rate"><p>${bicycle.discount}% Off</p></div>`);
          } else{

               html = html.replace(/<%DISCOUNTRATE%>/g, ``);
         } 


         for(let index = 0; index < bicycle.star; index++ ){
           html = html.replace(/<%START%>/, 'checked');
         }
         html = html.replace(/<%START%>/g, '');


          return html;
}