
export default class Router {
    constructor(root, defaultPageId) {
        this._root = root
        this._defaultPageId = defaultPageId
        this._routes = {}
        this._currentPage = null
        this._ready = false
    }

    route(page) {
        this._routes[page.id] = page
    }

    start() {
        if(this._ready) return
        addEventListener('load', () => {this.redirect()})
        addEventListener('popstate', () => {this.redirect()})
        this._ready = true
    }

    back() {
        window.history.back()
    }

    redirect(pageId) {
        if(!this._ready) { return }

        const params = new URLSearchParams(window.location.search);
        const queryPageId = params.get('page');
        let newPageId = queryPageId;
        switch (true) {
            case pageId in this._routes:
                newPageId = pageId;
                window.history.pushState({}, null, `?page=${newPageId}`);
                break;
            case pageId:
                newPageId = this._defaultPageId;
                window.history.pushState({}, null, `?page=${newPageId}`);
                break;
            case !(queryPageId in this._routes) && this._defaultPageId in this._routes:
                newPageId = this._defaultPageId;
                window.history.replaceState({}, null, `?page=${newPageId}`);
                break;
        }

        if (this._currentPage) {
            this._currentPage.destroy();
        }

        if (newPageId in this._routes) {
            this._currentPage = this._routes[newPageId];
            this._currentPage.init();
            this._currentPage.renderTo(this._root);
        }
    }
}
