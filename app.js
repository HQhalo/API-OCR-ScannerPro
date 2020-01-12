const express = require('express');
const app = express();
const tesseractController = require('./tesseract.controller');
const bodyParser = require('body-parser');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const path = require('path');
var fs = require('fs');

const port = 3000;

app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(fileUpload({
    createParentPath: true
}));
app.use(cors());



app.post('/upload-image',async (req, res) => {
    console.log("upload image");
  
    try {
        if(!req.files) {
            console.log("no file");
            return res.send({error:true,msg: 'something wrong!'});
        } else {
            
            let image1 = req.files.image;
                        
            filename = 'avatar-'+Date.now()+path.extname(image1.name);
            direct  = path.join(__dirname, './uploads/',filename);
            console.log(direct);
            await image1.mv(direct);
            
            await tesseractController
            .recognizeImage(direct)
            .then((result) => {
                res.send({text:result})
            })
            .catch((err) => {
                res.status(500)
                    
            });
            await fs.unlinkSync(direct);
            // res.send({error:false,
            //     msg: 'File is uploaded',
            //     data: {
            //         name: filename,
            //         mimetype: image1.mimetype,
            //         size: image1.size
            //     }
            // });
        }
    } catch (err) {
        console.log(err);
        res.send({error:true,msg: 'err try catch!'});
    }
  });
app.listen(port, () => {
    console.log(`Server is listening at port ${port}`);
});
