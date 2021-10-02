<template>
  <div class="crud-file">
    <h1>CRUD FILE</h1>

    <!--    <form>-->
    <!--      <div class="form-group">-->
    <!--        <label>File name</label>-->
    <!--        <input id="fileName" type="text" class="form-control">-->
    <!--      </div>-->
    <!--      <div class="form-group">-->
    <!--        <label>Contents</label>-->
    <!--        <textarea id="fileContents" class="form-control" rows="5"></textarea>-->
    <!--      </div>-->
    <!--    </form>-->
    <form action="form-floating">
      <div class="form-floating mb-3">
        <input id="fileName" type="text" class="form-control" placeholder="File name">
        <label for="fileName">File name</label>
      </div>

      <div class="form-floating">
        <input id="fileContents" type="text" class="form-control" placeholder="Contents">
        <label for="fileContents">Contents</label>
      </div>

    </form>
    <button @click="readFile('abc')" ref="btnCreate" class="btn btn-default">Create</button>
    <button ref="btnRead" class="btn btn-default">Read</button>
    <button ref="btnDelete" class="btn btn-default">Delete</button>
  </div>
</template>
<script>

// import cv from 'opencv4nodejs';

export default {
  name: 'About',
  mounted() {
    // handle reply from the backend
    window.ipc.on('READ_FILE', (payload) => {
      console.log(payload.content);
    });
  },
  methods: {
    readFile(path) {
      // ask backend to read file
      const payload = {path};
      window.ipc.send('READ_FILE', payload);
    },
  },
}
</script>
