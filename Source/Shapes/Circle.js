/*
---

name: "Shapes.Circle"

description: "Provides circle as canvas object"

license:
	- "[GNU Lesser General Public License](http://opensource.org/licenses/lgpl-license.php)"
	- "[MIT License](http://opensource.org/licenses/mit-license.php)"

authors:
	- "Shock <shocksilien@gmail.com>"

requires:
	- LibCanvas
	- Point
	- Shape

provides: Shapes.Circle

...
*/

/**
 * @class
 * @name Circle
 * @name LibCanvas.Shapes.Circle
 */
var Circle = LibCanvas.declare( 'LibCanvas.Shapes.Circle', 'Circle',
/** @lends {Circle#} */
{
	parent: Shape,
	proto: {
		set : function () {
			var a = Array.pickFrom(arguments);

			if (a.length >= 3) {
				this.center = new Point(a[0], a[1]);
				this.radius = a[2];
			} else if (a.length == 2) {
				this.center = Point(a[0]);
				this.radius = a[1];
			} else {
				a = a[0];
				this.radius = [a.r, a.radius].pick();
				if ('x' in a && 'y' in a) {
					this.center = new Point(a.x, a.y);
				} else if ('center' in a) {
					this.center = Point(a.center);
				} else if ('from' in a) {
					this.center = new Point(a.from).move({
						x: this.radius,
						y: this.radius
					});
				}
			}
			if (this.center == null) throw new TypeError('center is null');
			if (this.radius == null) throw new TypeError('radius is null');
		},
		// we need accessors to redefine parent "get center"
		get center ( ) { return this._center; },
		set center (c) { this._center = c; },
		grow: function (size) {
			this.radius += size/2;
			return this;
		},
		getCoords : function () {
			return this.center;
		},
		hasPoint : function (point) {
			return this.center.distanceTo(point) <= this.radius;
		},
		scale : function (factor, pivot) {
			if (pivot) this.center.scale(factor, pivot);
			this.radius *= factor;
			return this;
		},
		getCenter: function () {
			return this.center;
		},
		intersect : function (obj) {
			if (obj instanceof this.constructor) {
				return this.center.distanceTo(obj.center) < this.radius + obj.radius;
			} else {
				return this.getBoundingRectangle().intersect( obj );
			}
		},
		move : function (distance, reverse) {
			this.center.move(distance, reverse);
			return this;
		},
		processPath : function (ctx, noWrap) {
			if (!noWrap) ctx.beginPath();
			if (this.radius) {
				ctx.arc({
					circle : this,
					angle  : [0, (360).degree()]
				});
			}
			if (!noWrap) ctx.closePath();
			return ctx;
		},
		getBoundingRectangle: function () {
			var r = this.radius, center = this.center;
			return new Rectangle(
				new Point(center.x - r, center.y - r),
				new Point(center.x + r, center.y + r)
			);
		},
		clone : function () {
			return new this.constructor(this.center.clone(), this.radius);
		},
		getPoints : function () {
			return { center : this.center };
		},
		equals : function (shape, accuracy) {
			return shape instanceof this.shape &&
				shape.radius == this.radius    &&
				shape.center.equals(this.center, accuracy);
		},
		dump: function () {
			return '[shape Circle(center['+this.center.x+', '+this.center.y+'], '+this.radius+')]';
		}
	}
});