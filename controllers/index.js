
// returning the status code 200 for the healthz api
exports.healthz = (req, res) => {
    res.status(200).send({});
};
  