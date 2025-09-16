"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AssumptionsEditor = AssumptionsEditor;
var react_1 = require("react");
function AssumptionsEditor(_a) {
    var value = _a.value, onChange = _a.onChange;
    var _b = (0, react_1.useState)(value), local = _b[0], setLocal = _b[1];
    (0, react_1.useEffect)(function () { return setLocal(value); }, [value.id]);
    function numberInput(key, factor) {
        if (factor === void 0) { factor = 1; }
        return (<input type="number" step="0.0001" value={local[key] * factor} onChange={function (e) {
                var _a, _b;
                var raw = Number(e.target.value) / factor;
                var next = __assign(__assign({}, local), (_a = {}, _a[key] = raw, _a));
                setLocal(next);
                onChange((_b = {}, _b[key] = raw, _b));
            }}/>);
    }
    return (<div className="assumptions-editor" style={{ display: "grid", gap: 8 }}>
			<label>
				Down Payment %
				{numberInput("downPaymentPct", 100)}
			</label>
			<label>
				Interest 30yr %
				{numberInput("interestRate30yr", 100)}
			</label>
			<label>
				Interest 15yr %
				{numberInput("interestRate15yr", 100)}
			</label>
			<label>
				Interest 5yr ARM %
				{numberInput("interestRate5yrArm", 100)}
			</label>
			<label>
				ARM Amort Years
				<input type="number" value={local.armAmortYears} onChange={function (e) {
            var val = Number(e.target.value);
            setLocal(__assign(__assign({}, local), { armAmortYears: val }));
            onChange({ armAmortYears: val });
        }}/>
			</label>
			<label>
				Property Tax %
				{numberInput("propertyTaxRatePct", 100)}
			</label>
			<label>
				Maintenance %
				{numberInput("maintenanceRatePct", 100)}
			</label>
			<label>
				Vacancy %
				{numberInput("vacancyRatePct", 100)}
			</label>
		</div>);
}
