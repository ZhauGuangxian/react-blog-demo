
function isLocalStorageSupported() {
    var testKey = 'test',
        storage = window.sessionStorage;
    try {
        storage.setItem(testKey, 'testValue');
        storage.removeItem(testKey);
        return true;
    } catch (error) {
        return false;
    }
}

function padLeftZero(str) {
    return ('00' + str).substr(str.length);
}
module.exports = {
    handleWrapperMove: (type, childClass = ".blackWrapper", e) => {

        let element = e.target;
        let isorigin = Number(element.getAttribute('data-origin'));
        while (isorigin !== 1) {
            element = element.parentNode;
            isorigin = Number(element.getAttribute('data-origin'));
        }
        var x1, y1, x4, y4, x0, y0;

        //表示左上角和右下角的对角线斜率
        var k;

        //用getBoundingClientRect比较省事，而且它的兼容性还不错
        var rect = element.getBoundingClientRect();

        if (!rect.width) {
            rect.width = rect.right - rect.left;
        }

        if (!rect.height) {
            rect.height = rect.bottom - rect.top;
        }

        //求各个点坐标 注意y坐标应该转换为负值，因为浏览器可视区域左上角为(0,0)，整个可视区域属于第四象限
        x1 = rect.left;
        y1 = -rect.top;

        x4 = rect.left + rect.width;
        y4 = -(rect.top + rect.height);

        x0 = rect.left + rect.width / 2;
        y0 = -(rect.top + rect.height / 2);

        //矩形不够大，不考虑
        if (Math.abs(x1 - x4) < 0.0001) return 4;

        //计算对角线斜率
        k = (y1 - y4) / (x1 - x4);

        var range = [k, -k];

        //表示鼠标当前位置的点坐标
        var x, y;

        x = e.clientX;
        y = -e.clientY;

        //表示鼠标当前位置的点与元素中心点连线的斜率
        var kk;

        kk = (y - y0) / (x - x0);
        var direction = 0;
        //如果斜率在range范围内，则鼠标是从左右方向移入移出的
        if (isFinite(kk) && range[0] < kk && kk < range[1]) {
            //根据x与x0判断左右
            direction = x > x0 ? 1 : 3;
        } else {
            //根据y与y0判断上下
            direction = y > y0 ? 0 : 2;
        }
        var dirs = ['top', 'right', 'bottom', 'left'];

        let wrap = element.querySelector(childClass);

        if (type === 'in') {
            wrap.classList.remove('wrapperTrans');
            switch (direction) {
                case 0:
                    wrap.style.top = '-100%';
                    wrap.style.left = "0";
                    break;
                case 1:
                    wrap.style.top = '0%';
                    wrap.style.left = "100%";
                    break;
                case 2:
                    wrap.style.top = '100%';
                    wrap.style.left = "0";
                    break;
                case 3:
                    wrap.style.top = '0%';
                    wrap.style.left = "-100%";
                    break;
                default: break;
            }
            let w2 = wrap.offsetWidth;
            wrap.classList.add('wrapperTrans');
            wrap.style.top = '0%';
            wrap.style.left = "0%";
        } else {
            wrap.classList.add('wrapperTrans');
            switch (direction) {
                case 0:
                    wrap.style.top = '-100%';
                    wrap.style.left = "0"; break;
                case 1:
                    wrap.style.top = '0%';
                    wrap.style.left = "100%"; break;
                case 2:
                    wrap.style.top = '100%';
                    wrap.style.left = "0"; break;
                case 3:
                    wrap.style.top = '0%';
                    wrap.style.left = "-100%"; break;
                default: break;
            }
        }

    },
    setSessionStore: (name, content) => {
        if (!name) return;
        if (typeof content !== 'string') {
            content = JSON.stringify(content);
        }
        if (isLocalStorageSupported) {
            window.sessionStorage.setItem(name, content);
        } else {
            setCookie(name, content);
        }
    },
    removeSessionStore: name => {
        if (!name) return;
        if (isLocalStorageSupported) {
            window.sessionStorage.removeItem(name);
        } else {
            removeCookie(name);
        }
    },
    formatDate: (time, fmt) => {
        var date = new Date(time)
        if (/(y+)/.test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
        }
        let o = {
            'M+': date.getMonth() + 1,
            'd+': date.getDate(),
            'h+': date.getHours(),
            'm+': date.getMinutes(),
            's+': date.getSeconds(),
        }
        for (let k in o) {
            if (new RegExp(`(${k})`).test(fmt)) {
                let str = o[k] + '';
                fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? str : padLeftZero(str));
            }
        }
        return fmt;
    },
    addnowHMS: (origin) => {
        let now = new Date(); let h = now.getHours() + ''; let m = now.getMinutes() + ''; let s = now.getSeconds() + '';
        origin += ' ' + (h < 10 ? '0' + h : h) + ':' + (m < 10 ? '0' + m : m) + ':' + (s < 10 ? '0' + s : s);
        return origin
    }
}




