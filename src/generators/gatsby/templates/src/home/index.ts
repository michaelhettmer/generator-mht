export { default } from './Home';
<% if (redux) { %>
export { default as homeState } from './state';

export * from './state';
<% } %>