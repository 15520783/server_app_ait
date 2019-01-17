var API_PATH = require('../../common/const.js').API_PATH;

module.exports = function (app, model) {
    app.post(API_PATH.NEW_JOB, (req, res) => CREATE_NEW_JOB(model, req, res));
    app.post(API_PATH.GET_JOB, (req, res) => GET_LIST_JOB(model, req, res));
}

function CREATE_NEW_JOB(model, req, res) {
    if (req.userId || req.body) {

        const insert_job = {
            title: req.body.title,
            position: req.body.position,
            skill: "Default",
            expiredDate: req.body.expiredDate,
            poster: req.userId,
            create_by: req.userId
        }

        const list_description = [];
        const list_requirementJob = [];
        const list_benefit = [];
        const list_requireFile = [];

        //TODO: insert job
        model.job.create(insert_job, (err, new_job) => {
            if (err) {
                return res.status(400).send(err);
            }

            let List_Error = [];

            req.body.descriptionJob.forEach(element => {
                list_description.push({
                    description: element.description,
                    idjob: new_job.id,
                    create_by: req.userId
                })
            });

            req.body.requirementJob.forEach(element => {
                list_requirementJob.push({
                    requirement: element.requirement,
                    idjob: new_job.id,
                    create_by: req.userId
                })
            });

            req.body.benefitJob.forEach(element => {
                list_benefit.push({
                    benefit: element.benefit,
                    idjob: new_job.id,
                    create_by: req.userId
                })
            })

            req.body.requirementFile.forEach(element => {
                list_requireFile.push({
                    requirement: element.requirement,
                    idjob: new_job.id,
                    create_by: req.userId
                })
            })
            //TODO:insert description for job
            model.descrip.create(list_description, (err, new_list_description) => {
                if (err) List_Error.push(err);
            })
            //TODO: insert requirement for job
            model.require_job.create(list_requirementJob, (err, new_list_requirementJob) => {
                if (err) List_Error.push(err);
            })
            //TODO: insert benefit info for job
            model.benefits.create(list_benefit, (err, new_list_benefit) => {
                if (err) List_Error.push(err);
            })
            //TODO: insert requirement resume for job
            model.require_resume.create(list_requireFile, (err, new_list_requireFile) => {
                if (err) List_Error.push(err);
            })

            if (List_Error && List_Error.length > 0) {
                return res.status(400).send(List_Error);
            }

            return res.status(200).send(new_job);
        })
    }
}


function GET_LIST_JOB(model, req, res) {
    if (req.userId) {
        model.job.find({
            include: [
                {
                    relation: "descrip",
                    scope: {
                        fields: ['description']
                    }
                },
                {
                    relation: "requireJob",
                    scope: {
                        fields: ['requirement']
                    }
                },
                {
                    relation: "benefit",
                    scope: {
                        fields: ['benefit']
                    }
                },
                {
                    relation: "requireResume",
                    scope: {
                        fields: ['requirement']
                    }
                }
            ],
            where:{del_flag:0}
        }, (err,jobs)=>{
            if(err){
                return res.status(400).send(err);
            }
            return res.status(200).send(jobs);
        });
    }
}