!function(){
    "use strict";

    //�Ƿ���ʾ���checkbox
    var dotChoose = document.getElementById("dot");
    //�Ƿ���ʾ�����checkbox
    var rectChoose = document.getElementById("rect");
    //�Ƿ���ʾ��ͼ��checkbox
    var picChoose = document.getElementById("pic");
    //��ͼƬ�ָ�ķ�������
    var countChoose = document.getElementById("count");

    //��ȡurl������Ĳ���
    var a = document.createElement("A");
    a.href = window.location.href;
    var ret = {},
        seg = a.search.replace(/^\?/ , '').split("&"),
        len = seg.length,
        i = 0,s;
    for(;i<len;i++){
        if(!seg[i])continue;
        s = seg[i].split("=");
        ret[s[0]] = s[1];
    }

    //���url�����и����������ò�����ֵ
    if('dot' in ret){
        if(ret.dot==="true") dotChoose.setAttribute("checked","");
        else dotChoose.removeAttribute("checked");
    }
    if('rect' in ret){
        if(ret.rect==="true") rectChoose.setAttribute("checked","");
        else rectChoose.removeAttribute("checked");
    }
    if('pic' in ret){
        if(ret.pic==="true") picChoose.setAttribute("checked","");
        else picChoose.removeAttribute("checked");
    }

    var hasDot = dotChoose.checked,
        hasRect = rectChoose.checked,
        hasPic = picChoose.checked,
        count = getSelected();

    dotChoose.onchange = function(){ hasDot = this.checked;render(); };
    rectChoose.onchange = function(){ hasRect = this.checked;render(); };
    picChoose.onchange = function(){ hasPic = this.checked;render(); };
    countChoose.onchange = function(){
        count = getSelected();
        //count���ĺ���Ҫ���¼������е�ĳ�ʼλ��
        idots = rectsplit(count, dotscopy[0], dotscopy[1], dotscopy[2], dotscopy[3]);
        render();
    };

    function getSelected(){
        var ops = countChoose.getElementsByTagName("OPTION") ,op;
        for(var i=0;i<ops.length;i++){
            op = ops[i];
            if(op.selected)return +op.value;
        }
    }

    var canvas = document.getElementById("cas");
    var ctx = canvas.getContext("2d");

    var dots = [];
    var dotscopy , idots;

    var img = new Image();
    img.src = "./img/test.jpg";
    img.onload = function(){
        var img_w = img.width/2;
        var img_h = img.height/2;
        var left = (canvas.width - img_w)/2;
        var top = (canvas.height - img_h)/2;

        img.width = img_w;
        img.height = img_h;

        dots = [
            { x:left, y:top },
            { x:left + img_w, y:top },
            { x:left + img_w, y:top + img_h},
            { x:left, y:top + img_h}
        ];

        //����һ�ݲ���Ŀ���
        dotscopy = [
            { x:left, y:top },
            { x:left + img_w, y:top },
            { x:left + img_w, y:top + img_h},
            { x:left, y:top + img_h}
        ];

        //������г�ʼ������
        idots = rectsplit(count, dotscopy[0], dotscopy[1], dotscopy[2], dotscopy[3]);

        render()
    };

    /**
     * ����϶��¼���
     * @param e
     */
    window.onmousedown = function(e){
        if(!dots.length)return;

        var area = getArea(e);
        var dot,i;
        //����¼���������
        var qy = 40;

        for (i = 0; i < dots.length; i++) {
            dot = dots[i];
            if (area.t >= (dot.y - qy) && area.t <= (dot.y + qy) && area.l >= (dot.x - qy) && area.l <= (dot.x + qy)) {
                break;
            } else {
                dot = null;
            }
        }

        if(!dot) return;

        window.onmousemove = function(e){
            var narea = getArea(e);
            var nx = narea.l-area.l;
            var ny = narea.t-area.t;

            dot.x += nx;
            dot.y += ny;

            area = narea;

            render();
        };

        window.onmouseup = function(){
            window.onmousemove = null;
            window.onmouseup = null;
        }
    };

    /**
     * ��ȡ�����/�ƹ���λ��
     * @param e
     * @returns {{t: number, l: number}}
     */
    function getArea(e){
        e = e || window.event;
        return {
            t : e.clientY - canvas.offsetTop + document.body.scrollTop + document.documentElement.scrollTop,
            l : e.clientX - canvas.offsetLeft + document.body.scrollLeft + document.documentElement.scrollLeft
        }
    }

    /**
     * ������Ⱦ
     */
    function render(){
        ctx.clearRect(0,0,canvas.width,canvas.height);

        var ndots = rectsplit(count, dots[0], dots[1], dots[2], dots[3]);

        ndots.forEach(function(d , i){
            //��ȡƽ���ı��ε��ĸ���
            var dot1 = ndots[i];
            var dot2 = ndots[i + 1];
            var dot3 = ndots[i + count + 2];
            var dot4 = ndots[i + count + 1];

            //��ȡ��ʼƽ���ı��ε��ĸ���
            var idot1 = idots[i];
            var idot2 = idots[i + 1];
            var idot3 = idots[i + count + 2];
            var idot4 = idots[i + count + 1];

            if (dot2 && dot3 && i%(count+1)<count){
                //���������ε��°벿��
                renderImage(idot3, dot3, idot2, dot2, idot4, dot4);

                //���������ε��ϰ벿��
                renderImage(idot1, dot1, idot2, dot2, idot4, dot4);
            }

            if(hasDot){
                ctx.save();
                ctx.fillStyle = "red";
                ctx.fillRect(d.x-1 , d.y-1 , 2 , 2);
                ctx.save();
            }
        });
    }

    /**
     * �������ͬʱ��ȾͼƬ
     * @param arg_1
     * @param _arg_1
     * @param arg_2
     * @param _arg_2
     * @param arg_3
     * @param _arg_3
     */
    function renderImage(arg_1 , _arg_1 , arg_2 , _arg_2 , arg_3 , _arg_3){
        ctx.save();
        //���ݱ任������괴����������
        ctx.beginPath();
        ctx.moveTo(_arg_1.x, _arg_1.y);
        ctx.lineTo(_arg_2.x, _arg_2.y);
        ctx.lineTo(_arg_3.x, _arg_3.y);
        ctx.closePath();
        if(hasRect){
            ctx.lineWidth = 2;
            ctx.strokeStyle = "red";
            ctx.stroke();
        }
        ctx.clip();

        if(hasPic){
            //����任ǰ��ĵ����꣬����任����
            var result = matrix.getMatrix.apply(this , arguments);

            //����
            ctx.transform(result.a , result.b , result.c , result.d , result.e , result.f);

            //����ͼƬ
            ctx.drawImage(img , idots[0].x , idots[0].y , img.width , img.height);
        }

        ctx.restore();
    }


    /**
     * ��abcd�ı��ηָ��n��n�η��ݣ���ȡn�ȷֺ�����е�����
     * @param n     ���ٵȷ�
     * @param a     a������
     * @param b     b������
     * @param c     c������
     * @param d     d������
     * @returns {Array}
     */
    function rectsplit(n , a , b , c , d){
        //ad��������n�ȷ�
        var ad_x = (d.x - a.x)/n;
        var ad_y = (d.y - a.y)/n;
        //bc��������n�ȷ�
        var bc_x = (c.x - b.x)/n;
        var bc_y = (c.y - b.y)/n;

        var ndots = [];
        var x1, y1, x2, y2, ab_x, ab_y;

        //��ߵ�������ұߵ��������ȡÿһ�ε�������µ�����������n�ȷ֣��Ӷ���ȡ���е�����
        for(var i=0;i<=n;i++){
            //���ad����n�ȷֺ������
            x1 = a.x + ad_x * i;
            y1 = a.y + ad_y * i;
            //���bc����n�ȷֺ������
            x2 = b.x + bc_x * i;
            y2 = b.y + bc_y * i;

            for(var j=0;j<=n;j++){
                //ab����Ϊ��[x2 - x1 , y2 - y1]������n�ȷֺ������Ϊ����n
                ab_x = (x2 - x1)/n;
                ab_y = (y2 - y1)/n;

                ndots.push({
                    x: x1 + ab_x * j,
                    y: y1 + ab_y * j
                })
            }
        }

        return ndots;
    }
}();
