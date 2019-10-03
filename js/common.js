const MAX_ZOOM = 2.5;
const MIN_ZOOM = 0.03;
const SCALE_FACTOR = 0.9;


$(document).ready(function () {
    let width = $(window).width();
    let height = $(window).height();


    var mapDeviation = width / 2,
        centered,
        opened = false;

    $(window).resize(function () {
        svg.attr("width", $(window).width())
            .attr("height", $(window).height());
    });


    $('.zone-select__1').click(function (event) {
        openInfo('#bars');
    });

    $('.zone-select__2').click(function (event) {
        openInfo('#f-zone');
    });



    $('.full-block__area').click(event => {
        $('.zone-select__1').fadeOut();
        $('.zone-select__2').fadeOut();
        $('.zone-select__3').fadeIn();
        svg.transition()
            .duration(750)
            .call(zoom.transform, d3.zoomIdentity.translate(-158.38143743041087,-176.0232276552931).scale(0.03));
    });


    $('.kyrgyz-block').click(function (event) {

        $('.zone-select__1').fadeIn();
        $('.zone-select__2').fadeIn(function() {
            $('.zone-select__3').fadeOut()
        });

        moveToPoint(22500, 16000, scaleD);
        removeBox();
    });

    for (let i = 0; i < modalSecurityZones.length; i++) {
        $('<div/>', {
            'class': 'info-panel f-sec' + modalSecurityZones[i].id,
            'html': `<div class="info-panel__title">${modalSecurityZones[i].title}</div>
                        <div class="img-block">
                            <img src="${modalSecurityZones[i].image}" alt="">
                        </div>
                        <div class="info-panel__description">
                            ${modalSecurityZones[i].content}
                        </div>
                    </div>`
        }).appendTo('body');
    }
    for (let i = 0; i < modalSecurityZones.length; i++) {
        let zoneModal = $(`.f-sec${modalSecurityZones[i].id}`);

        zoneModalEvents($(`#f-sec${modalSecurityZones[i].id}`), zoneModal);


    }


    for (let i = 0; i < modalWindows.length; i++) {

        $('<div/>', {
            'class': 'info-panel f-zone' + modalWindows[i].id,
            'html': `<div class="info-panel__title">${modalWindows[i].title}</div>
                        <div class="img-block">
                            <img src="${modalWindows[i].image}" alt="">
                        </div>
                        <div class="info-panel__description">
                            ${modalWindows[i].content}
                        </div>
                    </div>`
        }).appendTo('body');

    }

    for (let i = 0; i < modalWindows.length; i++) {
        let zoneModal = $(`.f-zone${modalWindows[i].id}`);

        $(`#f-zone${modalWindows[i].id}`).click(function (event) {
            let bbox = d3.select(`#f-zone${modalWindows[i].id}`).node().getBBox();

            moveToZone(bbox, 750);

        });
        openBox($(`#f-zone${modalWindows[i].id}`), modalWindows[i], modalWindows.length, "#f-zone");
        zoneModalEvents($(`#f-zone${modalWindows[i].id}`), zoneModal);
    }

    for (let i = 0; i < modalInfo.length; i++) {

        $('<div/>', {
            'class': 'info-panel bars' + modalInfo[i].id,
            'html': `<div class="info-panel__title">${modalInfo[i].title}</div>
                        <div class="img-block">
                            <img src="${modalInfo[i].image}" alt="">
                        </div>
                        <div class="info-panel__description">
                            ${modalInfo[i].content}
                        </div>
                    </div>`
        }).appendTo('body');

    }

    for (let i = 0; i < modalInfo.length; i++) {

        let zoneModal = $(`.bars${modalInfo[i].id}`);

        $(`#bars${modalInfo[i].id}`).click(function (event) {

            let bbox = d3.select(`#bars${modalInfo[i].id}`).node().getBBox();

            moveToZone(bbox, 750);

        });

        openBox($(`#bars${modalInfo[i].id}`), modalInfo[i], modalInfo.length, "#bars");

        zoneModalEvents($(`#bars${modalInfo[i].id}`), zoneModal);
    }
    // Country ***********************
    for (let i = 0; i < modalCountry.length; i++) {

        $('<div/>', {
            'class': 'info-panel _' + modalCountry[i].id,
            'html': `<div class="info-panel__title">${modalCountry[i].title}</div>
                        <div class="info-panel__description">
                            ${modalCountry[i].content}
                        </div>
                    </div>`
        }).appendTo('body');

    }

    for (let i = 0; i < modalCountry.length; i++) {

        let zoneModal = $(`._${modalCountry[i].id}`);

        $(`#_${modalCountry[i].id}`).click(function (event) {

            let bbox = d3.select(`#_${modalCountry[i].id}`).node().getBBox();

            moveToZone(bbox, 750);

        });

        openBox($(`#_${modalCountry[i].id}`), modalCountry[i], modalCountry.length, "none");


        zoneModalEvents($(`#_${modalCountry[i].id}`), zoneModal);
    }
    //****************** ZOOM IMPLEMENTATION ********************
    let g = d3.select("#g");
    let svg = d3.select('#svg');

    svg.attr("width", $(window).width())
        .attr("height", $(window).height());

    let zoom = d3.zoom()
        .scaleExtent([MIN_ZOOM, MAX_ZOOM])
        .on("start", zoomStarted)
        .on("zoom", zooming)
        .on("end", zoomEnded);

    svg.call(zoom);

    let scaleD = d3.zoomTransform(svg.node()).k / 10; // current scale

    moveToPoint(22500, 16000, scaleD); // Kyrgyzstan

    function zooming() {

        let bbox = g.node().getBBox();
        let gWidth = bbox.width;
        let gHeight = bbox.height;
        let transform = d3.event.transform;

        transform.x = d3.max([d3.min([transform.x, 0]), -gWidth * transform.k + $(window).width()]);
        transform.y = d3.max([d3.min([transform.y, 0]), -gHeight * transform.k + $(window).height()]);
        transform.k = d3.event.transform.k;

        g.attr('transform', transform);
    }

    function zoomStarted(d) {
        if (d3.event.sourceEvent) {
            d3.event.sourceEvent.stopPropagation();
            d3.select(this).classed("dragging", true);
        }

    }

    function zoomEnded(d) {
        d3.select(this).classed("dragging", false);
    }


    function zoneModalEvents(element, modal) {
        element.mouseover(function (e) {
                modal.show();

            })
            .mouseleave(function () {
                modal.hide();
            })
            .mousemove(function (e) {
                let windowWidth = $(window).width() - e.pageX,
                    windowHeight = $(window).height() - e.pageY;

                if (windowWidth < 330) {
                    modal.css({
                        left: e.pageX - 320
                    });
                } else {
                    modal.css({
                        left: e.pageX + 20
                    });
                }

                if (windowHeight < 360) {
                    modal.css({
                        top: e.pageY - 320,
                    });
                } else {
                    modal.css({
                        top: e.pageY + 20,
                    });
                }
            });
    }


    function moveToZone(bbox, duration) {
        duration = duration ? duration : 0;
        let x = bbox.x + bbox.width / 2;
        let y = bbox.y + bbox.height / 2;
        let scale = (SCALE_FACTOR / Math.max(bbox.width / ($(window).width() - mapDeviation), bbox.height / $(window).height())).clamp(MIN_ZOOM, 1);
        let translate = [($(window).width() - mapDeviation) / 2 - scale * x, $(window).height() / 2 - scale * y];
        svg.transition()
            .duration(duration)
            .call(zoom.transform, d3.zoomIdentity.translate(translate[0], translate[1]).scale(scale));
    }

    function moveToPoint(x, y, scale, duration) {
        let translate = [($(window).width()) / 2 - scale * x, $(window).height() / 2 - scale * y];
        svg.transition()
            .duration(750)
            .call(zoom.transform, d3.zoomIdentity.translate(translate[0], translate[1]).scale(scale));
    }

    let duration = 700;

    function openBox(element, boxID, boxLength, name) {


        element.click(function (event) {

            if (centered != element) {
                var id = boxID.id;
                centered = element;

                if (!opened) {
                    opened = true;
                    $('.wrapper-info-box').append(`
                        <div class="info-box animated slideInRight">
                                <div class="info-box__main">
                                    <div class="info-box__title animated fadeInRight">${boxID.title}</div>
                                    <div class="img-block animated fadeInRight">
                                        <img src="${boxID.image}" alt="">
                                    </div>
                                    <div class="info-box__description animated fadeInRight">
                                        ${boxID.content}
                                    </div>
                                </div>
                                <ul class="info-box-pagination">
                                </ul>
                            </div>
                        </div>
                    `);

                    if(name != 'none') {
                        // arrows
                        $('<li/>', {
                            'class': 'arrow-prev arrow',
                            'html': '<img src="/img/arrow_left.png" width="32">'
                        }).click(function () {

                            centered = null;
                            id = id > 1 ? id - 1 : boxLength;
                            console.log(id)
                            $(name + id).trigger('click');

                        }).appendTo('.info-box-pagination')

                        $('<li/>', {
                            'class': 'arrow-next arrow',
                            'html': '<img src="/img/arrow_right.png" width="32">'
                        }).click(function () {

                            id = id < boxLength ? id + 1 : 1;
                            console.log(id)
                            $(name + id).trigger('click');
                            centered = name + id

                        }).appendTo('.info-box-pagination');
                    }
                    $('<div/>', {
                        'class': 'close-box',
                        'html': `<img src="img/close-btn.png" width="32">`
                    }).click(removeBox).appendTo('.info-box');

                } else {
                    $('.info-box__main').html(`
                        <div class="info-box__title animated fadeInRight">${boxID.title}</div>
                        <div class="img-block animated fadeInRight">
                            <img src="${boxID.image}" alt="">
                        </div>
                        <div class="info-box__description animated fadeInRight">
                            ${boxID.content}
                        </div>
                    `)
                }
                $('.zone-select').fadeOut();
            } else {
                removeBox(name);
            }
        });
    }

    function removeBox(name) {

        $('.info-box').hide("slide", {
            direction: "right"
        }, duration, function() {
            $(this).remove();
        });

        $('.zone-select').fadeIn();
        opened = false;
        centered = null;
        if(name != 'none') {
            moveToPoint(22500, 16000, scaleD);
        } else {
            svg.transition()
            .duration(750)
            .call(zoom.transform, d3.zoomIdentity.translate(-158.38143743041087,-176.0232276552931).scale(0.03));
        }
    }

    function openInfo(name) {
        $(name + '1').trigger('click');
    }

});

Number.prototype.clamp = function (min, max) {
    return Math.min(Math.max(this, min), max);
};