/* eslint-disable @typescript-eslint/no-var-requires */
const path = require(`path`);

exports.createPages = async ({ actions: { createPage }, reporter }) => {
    const activity = reporter.activityTimer(`creating pages`);
    activity.start();

    createPage({
        path: `/404`,
        component: path.resolve(`./src/base/404.tsx`),
    });
    createPage({
        path: `/`,
        component: path.resolve(`./src/home/Home.tsx`),
    });

    activity.end();
};
