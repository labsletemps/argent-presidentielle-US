$(document).ready(function()
{
	// @ not codekit-prepend "matter-animation.js";

	/*
		Scènes ScrollMagic
	*/

		// init controller
		var controller = new ScrollMagic.Controller();

		var tweens = new TimelineMax()
			// ouverture du cadran
			.add(TweenMax.to("#leftCurtain, #rightCurtain", 1.2, {transform: "translateX(0"}),"first")
			// .add(TweenMax.to("#rightCurtain", 1.2, {transform: "translateX(0)"}),"first");
			.add(TweenMax.to(".curtains-text", 1.2, {opacity: 1}),"second");

			// on construit la scene
			var scene = new ScrollMagic.Scene({
				triggerElement: "#trigger-curtains"
			}).setClassToggle("#chart-1", "bounce")
			.setTween(tweens)
			.addTo(controller)
			//.addIndicators({'name': 'curtains'}) // debug

	
});
