function createCrop() {
    var cropping = false;
    var bounds = {
        x: 0,
        y: 0,
        cWidth: 0,
        cHeight: 0,
        tWidth: 0,
        tHeight: 0,
        aWidth: 0,
        aHeight: 0
    };
    var dotSize = 12;

    var cropBox = document.getElementById('cropBox');
    var cropP = cropBox.parentNode;

    cropP.removeChild(cropBox);

    return {
        getBounds: function() {
            return bounds;
        },

        setBounds: function(b) {
            bounds = b;
        },

        updateImgBounds: function() {
            cropBox.style.width  = bounds.tWidth  + 'px';
            cropBox.style.height = bounds.tHeight + 'px';
        },

        hide: function() {
            cropP.removeChild(cropBox);
        },

        destroy: function() {
            if(cropping) {
                toggleCrop();
            }
            if(cropBox) {
                cropBox.innerHTML = '';
            }
        },

        endCrop: function() {
            if(cropping) {
                toggleCrop();
            }
        },

        resetCrop: function() {
            toggleCrop();
            toggleCrop();
        },

        toggleCrop: toggleCrop
    };

    function toggleCrop() {
        if(cropping) {
            crop.innerHTML = 'Start Cropping';
            
            for(var i = 0; i < cropBox.children.length; i++) {
                var n = cropBox.children[i];
                if(!/Blur/.test(n.id)) {
                    cropBox.removeChild(n);
                    i--;
                }
            }
        } else {
            cropP.appendChild(cropBox);
            cropBox.style.top = img.offsetTop + 'px';
            crop.innerHTML = 'Finish Cropping';
            
            var blurs = [];
            if(cropBox.children.length > 0) {
                for(var i = 0; i < cropBox.children.length; i++) {
                    blurs.push(cropBox.children[i]);
                }
            } else {
                for(var i = 0; i < 4; i++) {
                    var blur = document.createElement('Div');
                    blur.className = 'blur';
                    blur.id = 'Blur' + i;
                    blurs.push(blur);
                    cropBox.appendChild(blur);
                }
            }
            positionBlurs(blurs);

            var dots = [];
            for(var i = 0; i < 4; i++) {
                var dot = document.createElement('Div');
                dot.className = 'dot';
                dot.id = 'Dot' + i;
                events(dot, 'mousedown', startDrag);
                dots.push(dot);
                cropBox.appendChild(dot);
            }
            positionDots(dots);

            var box = document.createElement('Div');
            box.className = 'box';
            box.id = 'Box0';
            events(box, 'mousedown', startDrag);
            positionBox(box);
            cropBox.appendChild(box);
            
        }
        cropping = !cropping;

        function startDrag(e) {
            // prevent annoying selection while dragging
            document.body.className = 'noselect';

            if(!e) {
                e = window.event;
            }

            var sx = e.clientX;
            var sy = e.clientY;
            var t = e.target || e.srcElement;
            var i = parseInt(t.id.charAt(3), 10);
            var hor = dots[(i + 1) % 2 + (parseInt(i/2) * 2)];
            var ver = dots[(i + 2) % 4];
            var boundsH = i % 2;
            var boundsV = i > 1;

            var ix = parseInt(t.style.left, 10);
            var iy = parseInt(t.style.top, 10);
            var w = bounds.cWidth - bounds.x;
            var h = bounds.cHeight - bounds.y;
            var update = /Dot/.test(t.id) ? free : move;

            events(document.body, 'mousemove', drag);
            events(document.body, 'mouseup', endDrag);

            function drag(e) {
                var dx = e.clientX - sx;
                var dy = e.clientY - sy;

                update(dx, dy);
            }

            function endDrag(e) {
                // allow non-annoying selection
                document.body.className = '';

                events(document.body, 'mousemove', drag, true);
                events(document.body, 'mouseup', endDrag, true);
            }

            function free(dx, dy) {
                var pos = checkBounds(
                    { left: dx + ix, top: dy + iy},
                    { x: dotSize, y: dotSize }
                );
                
                if(boundsH) {
                    bounds.cWidth = pos.left + dotSize;
                } else {
                    bounds.x = pos.left;
                }

                if(boundsV) {
                    bounds.cHeight = pos.top + dotSize;
                } else {
                    bounds.y = pos.top;
                }
                positionBox(box);
                
                // OPTIMIZE
                positionBlurs(blurs);

                // Only update the three dots that have moved
                // -- Could also just do positionDots(dots)
                t.style.left = pos.left + 'px';
                t.style.top = pos.top + 'px';
                hor.style.top = pos.top + 'px';
                ver.style.left = pos.left + 'px';
            }

            function vert(dx, dy) {
            }

            function hor(dx, dy) {
            }

            function move(dx, dy) {
                var pos = checkBounds(
                    { left: dx + ix, top: dy + iy },
                    { x: w, y: h }
                );

                bounds.cWidth = pos.left + w;
                bounds.cHeight = pos.top + h;
                bounds.x = pos.left;
                bounds.y = pos.top;

                positionDots(dots);
                positionBlurs(blurs);
                positionBox(box, true);
            }

            function checkBounds(pos, extra) {
                if(pos.left < 0) {
                    pos.left = 0;
                }
                if(pos.top < 0) {
                    pos.top = 0;
                }

                if(pos.left > bounds.tWidth - extra.x) {
                    pos.left = bounds.tWidth - extra.x;
                }
                if(pos.top > bounds.tHeight - extra.y) {
                    pos.top = bounds.tHeight - extra.y;
                }
                return pos;
            }
        }
    }

    function positionDots(dots) {
        for(var i = 0; i < dots.length; i++) {
            var dot = dots[i];
            dot.style.left = ((i % 2 == 1) ? (bounds.cWidth  - dotSize) : (bounds.x)) + 'px';
            dot.style.top  = ((i > 1) ? (bounds.cHeight - dotSize) : (bounds.y)) + 'px';
        }
    }

    function positionBlurs(blurs) {
        for(var i = 0; i < blurs.length; i++) {
            var blur = blurs[i];
            blur.style.left = ((i < 3) ? 0 : (bounds.cWidth)) + 'px';
            blur.style.width = ((i < 2) ? bounds.tWidth + 'px' : (((i === 2) ? bounds.x : (bounds.tWidth - bounds.cWidth)) + 'px'));
            blur.style.top = ((i === 0) ? 0 : (i > 1) ? (bounds.y) : bounds.cHeight) + 'px';
            blur.style.height = ((i === 0) ? bounds.y : (i > 1) ? bounds.cHeight - bounds.y : bounds.tHeight - bounds.cHeight) + 'px';
        }
    }

    function positionBox(box, pos) {
        box.style.left   = bounds.x + 'px';
        box.style.top    = bounds.y + 'px';
        if(!pos) {
            box.style.width  = (bounds.cWidth  - bounds.x - 2) + 'px';
            box.style.height = (bounds.cHeight - bounds.y - 2) + 'px';
        }            
    }
};

