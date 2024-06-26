declare module "*.module.css";

declare module "*.worker.js" {
  const WorkerFactory: new () => Worker;
  export default WorkerFactory;
}
