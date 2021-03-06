import React from 'react';
import { withStyles } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import { selectFrom } from '../vendor/vectors';
import { COMBOS, PLATFORMS, TESTS } from './config';
import { withNavigation } from '../vendor/components/navigation';
import Picker from '../vendor/components/navigation/Picker';
import DashboardPage from '../utils/DashboardPage';
import PerfherderGraphContainer from '../utils/PerfherderGraphContainer';
import { timePickers } from '../utils/timePickers';
import { TimeDomain } from '../vendor/jx/domains';

const styles = {
  chart: {
    justifyContent: 'center',
    padding: '1rem',
  },
};

class Power extends React.Component {
  render() {
    const {
      classes, navigation, suite, browser, past, ending,
    } = this.props;
    const timeDomain = new TimeDomain({ past, ending, interval: 'day' });
    const browserFilter = selectFrom(COMBOS)
      .where({ browser, suite })
      .first().filter;

    return (
      <DashboardPage
        title="Power Usage"
        key={`page_${browser}_${suite}_${past}_${ending}`}
      >
        {navigation}
        <Grid container spacing={24}>
          {selectFrom(TESTS).map(({ id, label, filter: testFilter }) => (
            <Grid
              item
              xs={6}
              key={`page_${id}_${browser}_${suite}`}
              className={classes.chart}
            >
              <PerfherderGraphContainer
                timeDomain={timeDomain}
                title={label}
                series={selectFrom(PLATFORMS)
                  .map(({ label, filter: platformFilter }) => ({
                    label,
                    filter: {
                      and: [testFilter, platformFilter, browserFilter],
                    },
                  }))
                  .toArray()}
                missingDataInterval={10}
              />
            </Grid>
          ))}
        </Grid>
      </DashboardPage>
    );
  }
}

const nav = [
  {
    type: Picker,
    id: 'browser',
    label: 'Browser',
    defaultValue: 'geckoview',
    options: selectFrom(COMBOS)
      .groupBy('browserLabel')
      .map(([v]) => ({ id: v.browser, label: v.browserLabel })),
  },
  {
    type: Picker,
    id: 'suite',
    label: 'Suite',
    defaultValue: 'speedometer',
    options: selectFrom(COMBOS)
      .groupBy('suiteLabel')
      .map(([v]) => ({ id: v.suite, label: v.suiteLabel })),
  },
  ...timePickers,
];

export default withNavigation(nav)(withStyles(styles)(Power));
