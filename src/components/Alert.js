import React from 'react';
import { Grid, Card, CardContent, Typography, Divider, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TextField, MenuItem, Select, FormControl, InputLabel } from '@mui/material';
import { useTable, useSortBy, useFilters } from 'react-table';
import { Bar, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend } from 'chart.js';

// Register necessary components for Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend);

const Alert = ({ data }) => {
  // Calculate alert type counts for the bar chart
  const alertTypeCounts = data?.reduce((acc, event) => {
    const signature = event?.alert?.signature;
    if (signature) {
      acc[signature] = (acc[signature] || 0) + 1;
    }
    return acc;
  }, {});

  // Calculate severity counts for the pie chart
  const severityCounts = data?.reduce((acc, event) => {
    const severity = event?.alert?.severity;
    if (severity != null) {
      acc[severity] = (acc[severity] || 0) + 1;
    }
    return acc;
  }, {});

  // Bar chart configuration
  const barChartData = {
    labels: Object.keys(alertTypeCounts || {}),
    datasets: [
      {
        label: 'Number of Alerts',
        data: Object.values(alertTypeCounts || {}),
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
      },
    ],
  };

  const barChartOptions = {
    responsive: true,
    maintainAspectRatio: false, // Maintain aspect ratio to ensure responsiveness
    scales: {
      x: {
        beginAtZero: true,
      },
      y: {
        beginAtZero: true,
      },
    },
  };

  // Pie chart configuration
  const pieChartData = {
    labels: Object.keys(severityCounts || {}).map(severity => `Severity ${severity}`),
    datasets: [
      {
        data: Object.values(severityCounts || {}),
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(255, 206, 86, 0.2)',
          'rgba(75, 192, 192, 0.2)',
          'rgba(153, 102, 255, 0.2)',
          'rgba(255, 159, 64, 0.2)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const pieChartOptions = {
    responsive: true,
    maintainAspectRatio: false, // Maintain aspect ratio to ensure responsiveness
  };

  // Define columns for the table
  const columns = React.useMemo(() => [
    {
      Header: 'Timestamp',
      accessor: 'timestamp', // accessor is the "key" in the data
    },
    {
      Header: 'Source IP',
      accessor: 'src_ip',
    },
    {
      Header: 'Destination IP',
      accessor: 'dest_ip',
    },
    {
      Header: 'Port',
      accessor: 'port',
    },
    {
      Header: 'Protocol',
      accessor: 'protocol',
    },
    {
      Header: 'Severity',
      accessor: 'alert.severity',
    },
    {
      Header: 'Category',
      accessor: 'alert.category',
    },
  ], []);

  // Use the useTable hook to create the table instance
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    setFilter, // The useFilters hook adds a setFilter function to the table instance
  } = useTable(
    {
      columns,
      data: data || [],
    },
    useFilters,
    useSortBy
  );

  // Render the table UI
  return (
    <div className="alert">
      <div className="alert-details">
        <Grid container spacing={2}>
          {/* Grid item for alert type bar chart */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Number of Alerts by Type
                </Typography>
                <Divider />
                <div style={{ position: 'relative', height: '50vh', width: '100%' }}>
                  <Bar data={barChartData} options={barChartOptions} />
                </div>
              </CardContent>
            </Card>
          </Grid>
          {/* Grid item for severity distribution pie chart */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Severity Distribution
                </Typography>
                <Divider />
                <div style={{ position: 'relative', height: '50vh', width: '100%' }}>
                  <Pie data={pieChartData} options={pieChartOptions} />
                </div>
              </CardContent>
            </Card>
          </Grid>
          {/* Grid item for alert details table */}
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Alert Details
                </Typography>
                <Divider />
                {/* Filter input fields */}
                <Grid container spacing={2} style={{ marginBottom: '16px' }}>
                  <Grid item xs={12} md={4}>
                    <TextField
                      label="Search Source IP"
                      variant="outlined"
                      fullWidth
                      onChange={e => setFilter('src_ip', e.target.value || undefined)} // Set the filter for the src_ip column
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <TextField
                      label="Search Destination IP"
                      variant="outlined"
                      fullWidth
                      onChange={e => setFilter('dest_ip', e.target.value || undefined)} // Set the filter for the dest_ip column
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <FormControl fullWidth variant="outlined">
                      <InputLabel>Severity</InputLabel>
                      <Select
                        label="Severity"
                        onChange={e => setFilter('alert.severity', e.target.value || undefined)} // Set the filter for the severity column
                      >
                        <MenuItem value="">All</MenuItem>
                        <MenuItem value={1}>1</MenuItem>
                        <MenuItem value={2}>2</MenuItem>
                        <MenuItem value={3}>3</MenuItem>
                        <MenuItem value={4}>4</MenuItem>
                        <MenuItem value={5}>5</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>
                <TableContainer component={Paper}>
                  <Table {...getTableProps()}>
                    <TableHead>
                      {headerGroups.map(headerGroup => (
                        <TableRow {...headerGroup.getHeaderGroupProps()}>
                          {headerGroup.headers.map(column => (
                            <TableCell {...column.getHeaderProps(column.getSortByToggleProps())}>
                              {column.render('Header')}
                              {/* Add a sort direction indicator */}
                              <span>
                                {column.isSorted
                                  ? column.isSortedDesc
                                    ? ' 🔽'
                                    : ' 🔼'
                                  : ''}
                              </span>
                            </TableCell>
                          ))}
                        </TableRow>
                      ))}
                    </TableHead>
                    <TableBody {...getTableBodyProps()}>
                      {rows.map(row => {
                        prepareRow(row);
                        return (
                          <TableRow {...row.getRowProps()}>
                            {row.cells.map(cell => (
                              <TableCell {...cell.getCellProps()}>
                                {cell.render('Cell')}
                              </TableCell>
                            ))}
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </div>
    </div>
  );
};

export default Alert;
