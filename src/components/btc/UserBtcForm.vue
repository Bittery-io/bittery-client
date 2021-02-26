<template>
  <q-card class="shadow-10 bg-grey-2" v-if="this.userBtcWalletDto">
    <q-card-section>
      <header-qchip text="Your Bitcoin standard wallet" icon="mdi-bitcoin"></header-qchip>
    </q-card-section>
    <q-card-section>
      <div class="row q-pa-xs">
        <div class="col-12">
          <q-input
            type="text"
            onkeypress="return false;"
            name="email"
            square
            :value="this.userBtcWalletDto.bip49RootPublicKey"
            label="BIP49 Root Public Key">
            <template v-slot:before>
              <q-icon style="width:50px;" color="primary" name="mdi-key" />
            </template>
          </q-input>
          <q-tooltip>
            Your standard wallet BIP-49 root public key.
          </q-tooltip>
        </div>
      </div>
    </q-card-section>
  </q-card>
</template>

<script lang="ts">
  import GlobalMixin from "../../mixins/global-mixin";
  import { UserLndDto } from 'src/dto/user-lnd-dto';
  import QrCode from 'components/utils/QrCode.vue';
  import HeaderQchip from 'components/utils/HeaderQchip.vue';

  export default GlobalMixin.extend({
    components: { QrCode, HeaderQchip },
    name: 'UserBtcForm',
    props: {
      userBtcWalletDto: {
        type: UserLndDto,
        required: true,
      },
    },
  });

</script>
