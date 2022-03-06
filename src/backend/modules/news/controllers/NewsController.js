const NewsModel = require('../NewsModel');
const CatModel = require('../../cat/CatModel');
const  {multipleMongooseToObject, mongooseToObject} = require('../../../../util/mongoose');
const errorUtil =  require('../../../../util/errorNoti');
const permiUtil =  require('../../../../util/permission');

const fs = require('fs-extra')
const folder_module = 'news';
const module_name = 'Bài viết';
const folder_view = 'modules/'+folder_module+'/views';
const admin_path =  process.env.ADMIN_PATH;
const module_path = admin_path+'/'+folder_module;

class NewsController {
    show(req, res,next){ 
        permiUtil.auth(req.userId,'news_view',res)

        var itemPerPageDefault = 20
        if(Number.isInteger(req.query.page)){
            var page = req.query.page; 
        }else{ 
            var  page = 1;
        }
        if(Number.isInteger(req.query.itemPerPage)){
            var  itemPerPage = req.query.itemPerPage;
        }else{
            var  itemPerPage = itemPerPageDefault;
        }
        var skip = page * itemPerPage - itemPerPage;
        var query = {};
        Promise.all( [
            // courseQuery,
        
            NewsModel.find(query).populate({ path: 'cat_id', select: 'name slug' }).sortable(req).skip(skip).limit(itemPerPage), 
            NewsModel.countDocumentsDeleted(),
            NewsModel.count(),
            itemPerPageDefault
        ])
            .then(([newsList, deleteCount, TotalCount,itemPerPageDefault]) => res.render(folder_view + '/show',{
                deleteCount,
                title: module_name,
                newsList: multipleMongooseToObject(newsList),
                layout: 'mainBackend',
                folder_module,
                TotalCount: TotalCount,
                module_name,
                itemPerPageDefault,
                username: req.username,
                admin_path,
                module_path
            }))
            .catch(next);

    }
    //get / course/ create
    edit(req,res,next){
        permiUtil.auth(req.userId,'news_edit',res)

        Promise.all( [
            CatModel.find({}),
            NewsModel.findById(req.params.id)
        ])
            .then(([catList, news]) => res.render(folder_view + '/edit',{
                title: 'Sửa '+module_name,
                catList: multipleMongooseToObject(catList),
                layout: 'mainBackend',
                folder_module,
                module_name,
                news: mongooseToObject(news),
                host: req.headers.host,
                username: req.username,
                admin_path,
                module_path
            }))
            .catch(next);
    }
    //put/ course
    update(req,res,next){
        permiUtil.auth(req.userId,'news_edit',res)
        //xy ly hinh anh
        // xoa anh cu trong database 
        if(req.body.deleteImage == 'on'){
            try {
                fs.unlinkSync(`src/public/img/news/${req.params.id}/${req.body.oldImage}`);
                req.body.img = '';
                console.log('successfully deleted ');
            } catch (err) {
                // handle the error
                console.log(err);;
            }
        }

        NewsModel.updateOne({_id: req.params.id}, req.body, {runValidators: true})
            .then(() => {
                if(req.body.save == 'saveAndNew') {
                    // tao moi 
                    const NewsNew = new NewsModel(formData);
                    formData.name = 'Bản nháp';
                    formData.status = 'off';

                    NewsNew.save()
                        .then((news) =>  { 
                            // redirect 
                            var linkRedirect = module_path + '/' + news._id + '/edit';
                            res.redirect(linkRedirect)
                        })
                        .catch(error => {});
                }else if(req.body.save == 'saveAndReview'){
                    var linkRedirect = module_path + '/'+ req.params.id + '/edit';
                    res.redirect(linkRedirect);
                }
                // huy ban nhap va xoa 
                else if(req.body.save == 'caneAndDelete'){
                    const dir =  `src/public/img/${folder_module}/${req.params.id}`;
                    // xoa anh 
                    if (fs.existsSync(dir)) {
                        try {
                            fs.rmdir(dir, { recursive: true });
                        
                            console.log(`${dir} is deleted!`);
                        } catch (err) {
                            console.error(`Error while deleting ${dir}.`);
                        }
                    }

                    NewsModel.deleteOne({_id: req.params.id})
                        .then(() => res.redirect(module_path))
                        .catch(next)
                }else{
                    res.redirect(module_path);
                }
                
            })
            .catch(error => {
                errorUtil.messageFlash(error,req.session);
                res.redirect('back'); 
            })
    }

    uploadImages(req,res,next){
        permiUtil.auth(req.userId,'news_edit',res)
        res.send('up thanh cong')
    }
    store(req,res,next){
        permiUtil.auth(req.userId,'news_edit',res)
        const  formData = req.body;
        const NewsNew = new NewsModel(formData);
        NewsNew.save()
            .then((news) =>  { 
                // redirect 
                var linkRedirect = module_path+'/'+ news._id + '/edit';
                res.redirect(linkRedirect)
            })
            .catch(error => {

            });
    }
    // thung rac 
    trash(req, res, next){
        permiUtil.auth(req.userId,'news_view',res)
        NewsModel.findDeleted({}).sort({'deletedAt':'desc'})
            .then((newsList) => 
        
                res.render(folder_view + '/trash', {
                    newsList : multipleMongooseToObject(newsList),
                    title: 'Thùng rác '+ module_name,
                    layout: 'mainBackend',
                    host: req.headers.host,
                    folder_module: folder_module,
                    module_name: module_name,
                    username: req.username,
                    admin_path,
                    module_path
                }),
            )
            .catch(next);
    }


    
    // xoa men 
    destroy(req,res,next){
        permiUtil.auth(req.userId,'news_edit',res)
        NewsModel.delete({_id: req.params.id})
            .then(() => res.redirect('back'))
            .catch(next)
    }
    //xoa vinh vien 
    forceDestroy(req,res,next){
        permiUtil.auth(req.userId,'news_edit',res)
        const dir =  `src/public/img/${folder_module}/${req.params.id}`;
        // xoa anh 
        if (fs.existsSync(dir)) {
            try {
                fs.rmdir(dir, { recursive: true });
            
                console.log(`${dir} is deleted!`);
            } catch (err) {
                console.error(`Error while deleting ${dir}.`);
            }
        }

        NewsModel.deleteOne({_id: req.params.id})
            .then(() => res.redirect('back'))
            .catch(next)
    }
    //xoa all tat ca thung rac
    allDestroyTrash(req,res,next){
        permiUtil.auth(req.userId,'news_edit',res)
        NewsModel.deleteMany({deleted: true})
            .then((deleteMany) => {
                const dir =  `src/public/img/${folder_module}/${deleteMany._id}`;
                if (fs.existsSync(dir)) {
                    try {
                        fs.rmdir(dir, { recursive: true });
                    
                        console.log(`${dir} is deleted!`);
                    } catch (err) {
                        console.error(`Error while deleting ${dir}.`);
                    }
                }
                res.redirect('back')
            })
            .catch(next)
    }

    //patch/ course id resoter
    restore(req,res,next){
        permiUtil.auth(req.userId,'news_edit',res)
        NewsModel.restore({_id: req.params.id})
        .then(() => res.redirect('back'))
        .catch(next)
    }

    //post action 
    handleFormActions(req,res,next){
        permiUtil.auth(req.userId,'news_edit',res)
        switch(req.body.action){
            case 'delete':
                NewsModel.delete({_id: {$in: req.body.ids} })
                    .then(() => res.redirect('back'))
                    .catch(next)

                break;
            default:
                res.json({message: 'Hành động không hợp lệ'})
        }
    }


}

module.exports = new NewsController;