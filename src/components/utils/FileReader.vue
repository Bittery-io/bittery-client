<template>
  <div>
    <q-uploader
      :label="label"
      @added="getFile"
      @removed="removedFile"
      bordered
      style="max-width: 100%"
      :filter="checkFileType"
      :hide-upload-btn="true"
    />
  </div>
</template>

<script>
  import { showNotificationError } from 'src/api/notificatios-api';

  export default {
    name: 'FileReader',
    components: { },
    props: {
      label: {
        type: String,
        default: '',
        required: false,
      },
      fileNameFilter: {
        type: String,
        default: '',
        required: false,
      },
      fileTypeFilter: {
        type: String,
        default: '',
        required: false,
      },
      sizeKbLimit: {
        type: String,
        default: '',
        required: false,
      },
      asBase: {
        type: Boolean,
        default: false,
        required: false,
      },
    },
    data() {
      return {
        showPopup: false,
        errorMessage: 'Only files with .txt extension are accepted!',
      };
    },
    methods: {
      getFile(files) {
        const reader = new FileReader();
        console.log(this.asBase);
        if (this.asBase) {
          console.log('czytam jako base64');
          reader.readAsDataURL(files[0]);
        } else {
          reader.readAsText(files[0], 'UTF-8');
        }
        reader.onload = (evt) => {
          console.log('Uploaded file successfully');
          console.log(evt.target.result);
          let result = evt.target.result;
          if (this.asBase) {
            let encoded = result.toString().replace(/^data:(.*,)?/, '');
            if ((encoded.length % 4) > 0) {
              encoded += '='.repeat(4 - (encoded.length % 4));
            }
            console.log('mam encoded', encoded);
            result = encoded;
          }
          this.$emit('onFileUploaded', result);
        };
        reader.onerror = (evt) => {
          console.log('error', evt);
        };
      },
      removedFile() {
        this.$emit('onFileUploaded', '');
      },
      checkFileType(files) {
        let wasError = false;
        let res = files;
        if (res.length > 1) {
          showNotificationError('Adding file failed', `Please add only single file`);
          let wasError = true;
        }
        if (this.sizeKbLimit !=='') {
          res = files.filter((file) => file.size < (Number(this.sizeKbLimit) * 1000));
          if (!res || res.length === 0) {
            showNotificationError('Adding file failed', `File size limit is ${this.sizeKbLimit} kb`);
            wasError = true;
          }
        }
        if (this.fileNameFilter !=='' && !wasError) {
          res = files.filter((file) => file.name === this.fileNameFilter);
          if (!res || res.length === 0) {
            showNotificationError('Adding file failed', `Expected file with name ${this.fileNameFilter}`);
            wasError = true;
          }
        }
        if (this.fileTypeFilter !=='' && !wasError) {
          res = files.filter((file) => file.type === this.fileTypeFilter);
          if (!res || res.length === 0) {
            showNotificationError('Adding file failed', 'Your file has not expected mime type');
          }
        }
        return res;
      },
    },
  };
</script>
