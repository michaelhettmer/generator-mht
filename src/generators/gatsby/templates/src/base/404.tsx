import React, { memo } from 'react';
import SEO from '../components/SEO';
import styles from './404.module.css';

const NotFoundPage = () => (
    <div className={styles.ErrorRoot}>
        <SEO title="404: Not  found" />
        <div className={styles.ErrorContent}>
            <h1>NOT FOUND</h1>
            <p>You just hit a route that doesn&#39;t exist... the sadness.</p>
        </div>
    </div>
);

export default memo(NotFoundPage);
