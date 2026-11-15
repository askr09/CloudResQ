import { useState, useEffect, useCallback } from "react";
import "./App.css";

function App() {
  const [activePage, setActivePage] = useState("Dashboard");

  // AWS infrastructure states
  const [instances, setInstances] = useState([]);
  const [vpcs, setVpcs] = useState([]);
  const [terraformInfo, setTerraformInfo] = useState(null);
  const [cloudFormationInfo, setCloudFormationInfo] = useState(null);
  // Docker states
const [dockerInfo, setDockerInfo] = useState(null);
const [dockerLoading, setDockerLoading] = useState(false);
const [dockerError, setDockerError] = useState("");

  // Loading states
  const [loading, setLoading] = useState(false);
  const [vpcLoading, setVpcLoading] = useState(false);
  const [terraformLoading, setTerraformLoading] = useState(false);
  const [cloudFormationLoading, setCloudFormationLoading] = useState(false);

  // Error states
  const [error, setError] = useState("");
  const [vpcError, setVpcError] = useState("");
  const [terraformError, setTerraformError] = useState("");
  const [cloudFormationError, setCloudFormationError] = useState("");

  const menuItems = [
    "Dashboard",
    "Infrastructure",
    "Deployment",
    "Monitoring",
    "Security",
    "Cost Management",
  ];

  const descriptions = {
    Dashboard: "Overview of your cloud infrastructure and DevOps environment.",
    Infrastructure: "Manage AWS resources and infrastructure automation.",
    Deployment: "Docker containers and Jenkins CI/CD pipeline.",
    Monitoring: "Monitor CPU, memory, disk and network performance.",
    Security: "Manage IAM, access control and vulnerability scanning.",
    "Cost Management": "Review cloud billing, budgets and resource optimization.",
  };

  const infrastructureItems = [
    {
      title: "AWS EC2",
      subtitle: "Elastic Compute Cloud",
      description: "Manage virtual servers and compute instances.",
      unit: "Unit I",
    },
    {
      title: "AWS VPC",
      subtitle: "Virtual Private Cloud",
      description: "Manage virtual networks, subnets and security groups.",
      unit: "Unit I",
    },
    {
      title: "Terraform",
      subtitle: "Infrastructure as Code",
      description: "Provision and manage cloud infrastructure using code.",
      unit: "Unit II",
    },
    {
      title: "CloudFormation",
      subtitle: "AWS Infrastructure Automation",
      description: "Create and manage AWS resources using templates.",
      unit: "Unit II",
    },
  ];

  // Fetch AWS EC2 instances
  const fetchInstances = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/ec2/instances");

      if (!response.ok) {
        throw new Error("Unable to retrieve AWS instance information.");
      }

      const data = await response.json();
      setInstances(data.instances || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch AWS VPC information
  const fetchVpcs = useCallback(async () => {
    setVpcLoading(true);
    setVpcError("");

    try {
      const response = await fetch("/api/vpc");

      if (!response.ok) {
        throw new Error("Unable to retrieve AWS VPC information.");
      }

      const data = await response.json();
      setVpcs(data.vpcs || []);
    } catch (err) {
      setVpcError(err.message);
    } finally {
      setVpcLoading(false);
    }
  }, []);

  // Fetch Terraform information
  const fetchTerraform = useCallback(async () => {
    setTerraformLoading(true);
    setTerraformError("");

    try {
      const response = await fetch("/api/terraform");

      if (!response.ok) {
        throw new Error("Unable to retrieve Terraform information.");
      }

      const data = await response.json();
      setTerraformInfo(data);
    } catch (err) {
      setTerraformError(err.message);
    } finally {
      setTerraformLoading(false);
    }
  }, []);

  // Fetch AWS CloudFormation information
  const fetchCloudFormation = useCallback(async () => {
    setCloudFormationLoading(true);
    setCloudFormationError("");

    try {
      const response = await fetch("/api/cloudformation");

      if (!response.ok) {
        throw new Error("Unable to retrieve AWS CloudFormation information.");
      }

      const data = await response.json();
      setCloudFormationInfo(data);
    } catch (err) {
      setCloudFormationError(err.message);
    } finally {
      setCloudFormationLoading(false);
    }
  }, []);

  // Fetch Docker information
  const fetchDocker = useCallback(async () => {
    setDockerLoading(true);
    setDockerError("");

    try {
      const response = await fetch("/api/docker");

      if (!response.ok) {
        throw new Error("Unable to retrieve Docker information.");
      }

      const data = await response.json();
      setDockerInfo(data);
    } catch (err) {
      setDockerError(err.message);
    } finally {
      setDockerLoading(false);
    }
  }, []);

  // Load information when a module opens
  useEffect(() => {
    if (activePage === "Infrastructure") {
      fetchInstances();
      fetchVpcs();
      fetchTerraform();
      fetchCloudFormation();
    }

    if (activePage === "Deployment") {
      fetchDocker();
    }
  }, [
    activePage,
    fetchInstances,
    fetchVpcs,
    fetchTerraform,
    fetchCloudFormation,
    fetchDocker,
  ]);



  // Calculate EC2 instance counts
  const runningCount = instances.filter(
    (instance) => instance.state === "running"
  ).length;

  const stoppedCount = instances.filter(
    (instance) => instance.state === "stopped"
  ).length;

  // Infrastructure connection status
  const connectedStatus = {
    "AWS EC2": !error && instances.length > 0,
    "AWS VPC": !vpcError && vpcs.length > 0,
    Terraform:
      !terraformError && terraformInfo?.status === "Connected",
    CloudFormation:
      !cloudFormationError && cloudFormationInfo?.status === "Connected",
  };

  return (
    <div className="app">
      {/* Sidebar */}
      <aside className="sidebar">
        <h2 className="logo">CloudResQ</h2>
        <p className="subtitle">Cloud & DevOps Platform</p>

        <nav>
          {menuItems.map((item) => (
            <button
              key={item}
              className={
                activePage === item ? "nav-item active" : "nav-item"
              }
              onClick={() => setActivePage(item)}
            >
              {item}
            </button>
          ))}
        </nav>

        <div className="sidebar-footer">
          INT378 Project
          <br />
          Cloud Infrastructure & DevOps
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <header className="topbar">
          <div>
            <h1>{activePage}</h1>
            <p>CloudResQ / {activePage}</p>
          </div>

          <span className="status">● Project Workspace</span>
        </header>

        <section className="welcome">
          <h2>Welcome to CloudResQ</h2>
          <p>{descriptions[activePage]}</p>
        </section>

        {/* Dashboard */}
        {activePage === "Dashboard" && (
          <>
            <h2 className="section-title">Project Modules</h2>

            <div className="card-grid">
              {menuItems.slice(1).map((item, index) => (
                <div className="module-card" key={item}>
                  <div className="card-number">0{index + 1}</div>
                  <h3>{item}</h3>
                  <p>{descriptions[item]}</p>

                  <button onClick={() => setActivePage(item)}>
                    View Module →
                  </button>
                </div>
              ))}
            </div>
          </>
        )}
                {/* Infrastructure */}
        {activePage === "Infrastructure" && (
          <>
            <h2 className="section-title">Infrastructure Resources</h2>

            {/* Resource Cards */}
            <div className="card-grid">
              {infrastructureItems.map((item) => (
                <div className="module-card" key={item.title}>
                  <div className="card-number">{item.unit}</div>
                  <h3>{item.title}</h3>
                  <h4 className="resource-subtitle">{item.subtitle}</h4>
                  <p>{item.description}</p>

                  <span className="connection-status">
                    {connectedStatus[item.title]
                      ? "Connected"
                      : item.title in connectedStatus
                        ? "Not Connected"
                        : "Not Connected"}
                  </span>
                </div>
              ))}
            </div>

            {/* AWS EC2 Section */}
            <section className="module-content infrastructure-info">
              <h2>AWS EC2 Infrastructure</h2>
              <p>
                Live instance information retrieved from your AWS account.
              </p>

              <button onClick={fetchInstances} disabled={loading}>
                {loading ? "Refreshing..." : "↻ Refresh Instances"}
              </button>

              {error && <p className="notice">Error: {error}</p>}
              {loading && <p>Fetching AWS instance information...</p>}

              {!loading && !error && (
                <>
                  <div className="card-grid">
                    <div className="module-card">
                      <h3>Total Instances</h3>
                      <h2>{instances.length}</h2>
                    </div>

                    <div className="module-card">
                      <h3>Running</h3>
                      <h2>{runningCount}</h2>
                    </div>

                    <div className="module-card">
                      <h3>Stopped</h3>
                      <h2>{stoppedCount}</h2>
                    </div>
                  </div>

                  <h2>EC2 Instance Details</h2>

                  {instances.length === 0 ? (
                    <p>No EC2 instances found.</p>
                  ) : (
                    <div style={{ overflowX: "auto" }}>
                      <table
                        style={{
                          width: "100%",
                          borderCollapse: "collapse",
                          textAlign: "left",
                          marginTop: "16px",
                        }}
                      >
                        <thead>
                          <tr>
                            <th>Name</th>
                            <th>Instance ID</th>
                            <th>State</th>
                            <th>Type</th>
                            <th>Public IP</th>
                            <th>Private IP</th>
                            <th>Availability Zone</th>
                          </tr>
                        </thead>

                        <tbody>
                          {instances.map((instance) => (
                            <tr key={instance.instance_id}>
                              <td>{instance.name}</td>
                              <td>{instance.instance_id}</td>
                              <td>
                                <span
                                  style={{
                                    color:
                                      instance.state === "running"
                                        ? "green"
                                        : "gray",
                                    fontWeight: "bold",
                                  }}
                                >
                                  {instance.state}
                                </span>
                              </td>
                              <td>{instance.instance_type}</td>
                              <td>{instance.public_ip}</td>
                              <td>{instance.private_ip}</td>
                              <td>{instance.availability_zone}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </>
              )}
            </section>

            {/* AWS VPC Section */}
            <section className="module-content infrastructure-info">
              <h2>AWS VPC Infrastructure</h2>
              <p>
                Live VPC and subnet information retrieved from your AWS account.
              </p>

              <button onClick={fetchVpcs} disabled={vpcLoading}>
                {vpcLoading ? "Refreshing..." : "↻ Refresh VPC"}
              </button>

              {vpcError && <p className="notice">Error: {vpcError}</p>}
              {vpcLoading && <p>Fetching AWS VPC information...</p>}

              {!vpcLoading && !vpcError && (
                <>
                  <div className="card-grid">
                    <div className="module-card">
                      <h3>Total VPCs</h3>
                      <h2>{vpcs.length}</h2>
                    </div>

                    <div className="module-card">
                      <h3>Total Subnets</h3>
                      <h2>
                        {vpcs.reduce(
                          (total, vpc) => total + vpc.subnets.length,
                          0
                        )}
                      </h2>
                    </div>
                  </div>

                  {vpcs.map((vpc) => (
                    <div key={vpc.vpc_id} className="module-card">
                      <h3>VPC Details</h3>

                      <p>
                        <strong>VPC ID:</strong> {vpc.vpc_id}
                      </p>
                      <p>
                        <strong>CIDR Block:</strong> {vpc.cidr}
                      </p>
                      <p>
                        <strong>Status:</strong> {vpc.state}
                      </p>
                      <p>
                        <strong>Type:</strong>{" "}
                        {vpc.is_default ? "Default VPC" : "Custom VPC"}
                      </p>

                      <h3>Subnet Details</h3>

                      <div style={{ overflowX: "auto" }}>
                        <table
                          style={{
                            width: "100%",
                            borderCollapse: "collapse",
                            textAlign: "left",
                            marginTop: "12px",
                          }}
                        >
                          <thead>
                            <tr>
                              <th>Subnet ID</th>
                              <th>CIDR Block</th>
                              <th>Availability Zone</th>
                              <th>Status</th>
                            </tr>
                          </thead>

                          <tbody>
                            {vpc.subnets.map((subnet) => (
                              <tr key={subnet.subnet_id}>
                                <td>{subnet.subnet_id}</td>
                                <td>{subnet.cidr}</td>
                                <td>{subnet.availability_zone}</td>
                                <td>{subnet.state}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  ))}
                </>
              )}
            </section>
                        {/* Terraform Section */}
            <section className="module-content infrastructure-info">
              <h2>Terraform Infrastructure</h2>
              <p>
                Live Terraform information retrieved from your AWS infrastructure.
              </p>

              <button
                onClick={fetchTerraform}
                disabled={terraformLoading}
              >
                {terraformLoading
                  ? "Refreshing..."
                  : "↻ Refresh Terraform"}
              </button>

              {terraformError && (
                <p className="notice">
                  Error: {terraformError}
                </p>
              )}

              {terraformLoading && (
                <p>Fetching Terraform information...</p>
              )}

              {!terraformLoading &&
                !terraformError &&
                terraformInfo && (
                  <>
                    <div className="card-grid">
                      <div className="module-card">
                        <h3>Connection Status</h3>
                        <h2>{terraformInfo.status}</h2>
                      </div>

                      <div className="module-card">
                        <h3>Terraform Version</h3>
                        <h2>{terraformInfo.terraform_version}</h2>
                      </div>

                      <div className="module-card">
                        <h3>AWS Provider</h3>
                        <h2>{terraformInfo.aws_provider_version}</h2>
                      </div>

                      <div className="module-card">
                        <h3>Total Subnets</h3>
                        <h2>{terraformInfo.total_subnets}</h2>
                      </div>
                    </div>

                    <div className="module-card">
                      <h3>Terraform VPC Details</h3>

                      <p>
                        <strong>VPC ID:</strong>{" "}
                        {terraformInfo.vpc_id}
                      </p>

                      <p>
                        <strong>CIDR Block:</strong>{" "}
                        {terraformInfo.vpc_cidr}
                      </p>

                      <h3>Subnet IDs</h3>

                      <ul>
                        {terraformInfo.subnet_ids.map((subnetId) => (
                          <li key={subnetId}>{subnetId}</li>
                        ))}
                      </ul>
                    </div>
                  </>
                )}

              {!terraformLoading &&
                !terraformError &&
                !terraformInfo && (
                  <p>Terraform information is not available yet.</p>
                )}
            </section>

            {/* CloudFormation Section */}
            <section className="module-content infrastructure-info">
              <h2>AWS CloudFormation</h2>
              <p>
                Live stack information retrieved from AWS CloudFormation in
                the ap-south-1 region.
              </p>

              <button
                onClick={fetchCloudFormation}
                disabled={cloudFormationLoading}
              >
                {cloudFormationLoading
                  ? "Refreshing..."
                  : "↻ Refresh CloudFormation"}
              </button>

              {cloudFormationError && (
                <p className="notice">
                  Error: {cloudFormationError}
                </p>
              )}

              {cloudFormationLoading && (
                <p>Fetching CloudFormation information...</p>
              )}

              {!cloudFormationLoading &&
                !cloudFormationError &&
                cloudFormationInfo && (
                  <>
                    <div className="card-grid">
                      <div className="module-card">
                        <h3>Connection Status</h3>
                        <h2>{cloudFormationInfo.status}</h2>
                      </div>

                      <div className="module-card">
                        <h3>AWS Region</h3>
                        <h2>{cloudFormationInfo.region}</h2>
                      </div>

                      <div className="module-card">
                        <h3>Total Stacks</h3>
                        <h2>{cloudFormationInfo.total_stacks}</h2>
                      </div>
                    </div>

                    <h3>CloudFormation Stack Details</h3>

                    {cloudFormationInfo.stacks?.length === 0 ? (
                      <p>
                        No CloudFormation stacks found yet. The AWS
                        connection is active; no stack has been deployed.
                      </p>
                    ) : (
                      <div style={{ overflowX: "auto" }}>
                        <table
                          style={{
                            width: "100%",
                            borderCollapse: "collapse",
                            textAlign: "left",
                            marginTop: "16px",
                          }}
                        >
                          <thead>
                            <tr>
                              <th>Stack Name</th>
                              <th>Stack Status</th>
                              <th>Created</th>
                              <th>Resources</th>
                            </tr>
                          </thead>
                          <tbody>
                            {cloudFormationInfo.stacks.map((stack) => (
                              <tr key={stack.stack_id}>
                                <td>{stack.stack_name}</td>
                                <td>{stack.stack_status}</td>
                                <td>
                                  {stack.creation_time
                                    ? new Date(
                                        stack.creation_time
                                      ).toLocaleString()
                                    : "—"}
                                </td>
                                <td>{stack.resource_count}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </>
                )}

              {!cloudFormationLoading &&
                !cloudFormationError &&
                !cloudFormationInfo && (
                  <p>CloudFormation information is not available yet.</p>
                )}
            </section>

            {/* Infrastructure Overview */}
            <section className="module-content infrastructure-info">
              <h2>Infrastructure Overview</h2>

              <ul>
                <li>Provision virtual machines using AWS EC2.</li>
                <li>Configure networking using VPC and subnets.</li>
                <li>Automate infrastructure using Terraform.</li>
                <li>
                  Deploy AWS resources using CloudFormation templates.
                </li>
              </ul>
            </section>
          </>
        )}

{/* Deployment Module */}
{activePage === "Deployment" && (
  <>
    <h2 className="section-title">Docker Deployment</h2>

    <section className="module-content infrastructure-info">
      <h2>Docker Engine</h2>
      <p>
        Live Docker container and image information retrieved
        from your EC2 server.
      </p>

      <button onClick={fetchDocker} disabled={dockerLoading}>
        {dockerLoading ? "Refreshing..." : "↻ Refresh Docker"}
      </button>

      {dockerError && (
        <p className="notice">Error: {dockerError}</p>
      )}

      {dockerLoading && <p>Fetching Docker information...</p>}

      {!dockerLoading && dockerInfo && (
        <>
          <div className="card-grid">
            <div className="module-card">
              <h3>Connection Status</h3>
              <h2>{dockerInfo.status}</h2>
            </div>

            <div className="module-card">
              <h3>Docker Version</h3>
              <h2>{dockerInfo.docker_version}</h2>
            </div>

            <div className="module-card">
              <h3>Total Containers</h3>
              <h2>{dockerInfo.total_containers}</h2>
            </div>

            <div className="module-card">
              <h3>Running Containers</h3>
              <h2>{dockerInfo.running_containers}</h2>
            </div>

            <div className="module-card">
              <h3>Stopped Containers</h3>
              <h2>{dockerInfo.stopped_containers}</h2>
            </div>

            <div className="module-card">
              <h3>Docker Images</h3>
              <h2>{dockerInfo.total_images}</h2>
            </div>
          </div>

          <h2>Container Details</h2>

          {dockerInfo.containers?.length > 0 ? (
            <div style={{ overflowX: "auto" }}>
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  textAlign: "left",
                  marginTop: "16px",
                }}
              >
                <thead>
                  <tr>
                    <th>Container Name</th>
                    <th>Container ID</th>
                    <th>Image</th>
                    <th>Status</th>
                    <th>Ports</th>
                  </tr>
                </thead>

                <tbody>
                  {dockerInfo.containers.map((container) => (
                    <tr key={container.ID}>
                      <td>{container.Names}</td>
                      <td>{container.ID}</td>
                      <td>{container.Image}</td>
                      <td>
                        <span
                          style={{
                            color:
                              container.State === "running"
                                ? "green"
                                : "gray",
                            fontWeight: "bold",
                          }}
                        >
                          {container.Status}
                        </span>
                      </td>
                      <td>{container.Ports || "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p>No Docker containers found.</p>
          )}

          <h2 style={{ marginTop: "30px" }}>
            Docker Image Details
          </h2>

          {dockerInfo.images?.length > 0 ? (
            <div style={{ overflowX: "auto" }}>
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  textAlign: "left",
                  marginTop: "16px",
                }}
              >
                <thead>
                  <tr>
                    <th>Repository</th>
                    <th>Tag</th>
                    <th>Image ID</th>
                    <th>Size</th>
                  </tr>
                </thead>

                <tbody>
                  {dockerInfo.images.map((image) => (
                    <tr key={image.ID}>
                      <td>{image.Repository}</td>
                      <td>{image.Tag}</td>
                      <td>{image.ID}</td>
                      <td>{image.Size}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p>No Docker images found.</p>
          )}
        </>
      )}

      {!dockerLoading && dockerError && (
        <p>Docker information could not be loaded.</p>
      )}
    </section>

    <section className="module-content">
      <h2>Jenkins CI/CD Pipeline</h2>
      <p>
        Jenkins automation and GitHub webhook integration
        will be implemented in the next phase.
      </p>
      <span className="connection-status">
        Pending Implementation
      </span>
    </section>
  </>
)}


        {/* Other Modules */}
        {activePage !== "Dashboard" &&
        activePage !== "Infrastructure" &&
        activePage !== "Deployment" && (
            <section className="module-content">
              <h2>{activePage} Module</h2>
              <p>{descriptions[activePage]}</p>

              <p className="notice">
                This module is ready for implementation. We will connect the
                relevant cloud and DevOps tools step by step.
              </p>
            </section>
          )}
      </main>
    </div>
  );
}

export default App;