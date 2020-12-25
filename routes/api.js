'use strict';
const issueModel = require('../Issues')

module.exports = function (app) {
  app.route('/api/issues/:project')

    .get(async function (req, res) {
      try {
        let project = req.params.project;
        // identify project collection.
        const Issue = issueModel(project)
        let issues;
        // find the api based on query provided by user.
        if (req.query) {
          issues = await Issue.find(req.query)
          // the database cant filter the query return all from database.
          if (issues.length === 0) {
            issues = await Issue.find()
          }
          res.status(200).json(issues)
        } else {
          // if theres no query provided return everything.
          issues = await Issue.find()
          res.status(200).json(issues)
        }
      } catch (e) {
        res.status(500).json({
          err: e.message
        })
      }
    })

    .post(async function (req, res) {
      try {
        let project = req.params.project;
        let date = new Date().toISOString()
        let data = {
          ...req.body,
          open: true,
          created_on: date,
          updated_on: date
        }
        //identify project collection.
        const Issue = issueModel(project)
        //create new issue.
        const issue = new Issue({
          ...data
        })
        //check all the required fields are not empty
        if (issue.issue_title == '' || issue.issue_text == '' || issue.created_by == '') {
          return res.json({
            error: 'required field(s) missing'
          })
        }
        //save and return the data.
        await issue.save()
        res.status(200).json({
          assigned_to: issue.assigned_to,
          status_text: issue.status_text,
          open: true,
          _id: issue._id,
          issue_title: issue.issue_title,
          issue_text: issue.issue_text,
          created_by: issue.created_by,
          created_on: issue.created_on,
          updated_on: issue.updated_on

        })
      } catch (e) {
        res.status(500).json({
          err: e.message
        })
      }
    })

    .put(async function (req, res) {
      let project = req.params.project;
      // ensure at least one fields are sent along with req.body
      if (Object.keys(req.body).length < 2) {
        if (!req.body._id) {
          return res.send({
            error: 'missing _id'
          })
        }
        return res.send({
          error: 'no update field(s) sent',
          _id: req.body._id
        })
      }
      // identify the collection model
      const Issue = issueModel(project)
      // find the issue by id.
      let issue = await Issue.findOne({
        _id: req.body._id
      }).exec();
      // if theres no issue is provided.
      if (!issue) {
        return res.send({
          error: 'could not update',
          _id: req.body._id
        });
      }
      delete req.body._id;
      Object.keys(req.body).forEach(key => {
        issue[key] = req.body[key];
        issue.markModified('key');
      })
      issue.updated_on = Date();
      issue.save(function (err) {
        if (err) return handleError(err);
      });

      res.json({
        result: 'successfully updated',
        _id: issue._id
      })
    })

    .delete(async function (req, res) {

      let project = req.params.project;
      let id = req.body._id;
      if (!id) {
        return res.send({
          error: 'missing _id'
        });
      }
      const Issue = issueModel(project)
      let issue = await Issue.findOne({
        _id: id
      }).exec();
      if (!issue) {
        return res.send({
          error: 'could not delete',
          _id: id
        })
      } else {
        Issue.findByIdAndRemove({
          id
        });
        res.status(200).json({
          result: 'successfully deleted',
          _id: issue.id
        })
      }
    });

};