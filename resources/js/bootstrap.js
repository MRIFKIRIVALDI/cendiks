import axios from 'axios';
window.axios = axios;
window.axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

import { Ziggy } from './ziggy';
import { route as ziggyRoute } from 'ziggy-js';

window.route = (name, params, absolute) => ziggyRoute(name, params, absolute, Ziggy);
window.Ziggy = Ziggy;
