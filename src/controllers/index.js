module.exports = (req, res) => {

    return res.sendFile(__rootname + '/resources/index.html')
}