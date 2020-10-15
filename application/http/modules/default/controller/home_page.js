let controller = process.SC_CONTROLLER;
/**
 * class home_page
 * @param {class} test_model
 */
class home_page extends controller.default {
    constructor() {
        super();
        this.group_module = "default";
    }
    index() {
        this.app.res.writeHead(200, { "Content-Type": "text/html" });
        this.app.res.end("bla bla bla");
    }
    test() {
        this.loadModel(["test_model"]);
        this.app.res.writeHead(200, { "Content-Type": "text/html" });
        this.app.res.end(this.test_model.test_function());
        // this.var.title = this.test_model.test_function();
        // this.test_model.fromdb().then(
        //     (data) => {
        //         this.render("test", { test_1: JSON.stringify(data), test_2: "dasd" });
        //     }
        // );
    }
}
module.exports = home_page;

