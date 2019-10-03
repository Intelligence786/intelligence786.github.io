// $(document).ready(function () {
//     //****************** ZOOM IMPLEMENTATION ********************
//     let mainLayer = d3.select("#main_layer");
//     let svg = d3.select('#svg');
//
//     let zoom = d3.zoom()
//         .scaleExtent([1, 4])
//         .on("start", zoomStarted)
//         .on("zoom", zooming)
//         .on("end", zoomEnded);
//
//     svg.call(zoom);
//
//     function zooming() {
//         console.log("zooming");
//         mainLayer.attr('transform', `translate(${d3.event.transform.x}, ${d3.event.transform.y}) scale(${d3.event.transform.k})`);
//     }
//
//     function zoomStarted(d) {
//         console.log("zoomStarted");
//         d3.event.sourceEvent.stopPropagation();
//         // d3.select(this).classed("dragging", true);
//         $("#svg").css("cursor", "grabbing");
//     }
//
//
//     function zoomEnded(d) {
//         console.log("zoomEnded");
//         // d3.select(this).classed("dragging", false);
//         $("#svg").css("cursor", "grab");
//     }
//
// });


