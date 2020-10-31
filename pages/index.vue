<template>
  <div class="container">
    <teaser v-for="teaser of teasers" :key="teaser.id" :teaser="teaser" class="mb-10" />
    <loading-spinner v-if="isLoading" />
  </div>
</template>

<script>
import Teaser from '~/components/Teaser'
import LoadingSpinner from '~/components/LoadingSpinner'

export default {
  middleware: 'anonymous-access',
  components: {
    LoadingSpinner,
    Teaser
  },
  data () {
    return {
      teasers: [],
      eof: false,
      isLoading: false,
      lastDoc: null,
      batchSize: 10
    }
  },
  async mounted () {
    await this.loadBlogs()
  },
  methods: {
    async loadBlogs () {
      if (this.isLoading || this.eof) {
        return
      }

      this.isLoading = true
      const db = this.$firebase.firestore()

      console.log(db)

      let query = db.collection('teasers')
        .where('published', '==', true)
        .orderBy('created', 'desc')
        .limit(this.batchSize)

      if (this.lastDoc) {
        query = query.startAfter(this.lastDoc)
      }

      const querySnapshot = await query.get()

      this.eof = querySnapshot.empty

      if (querySnapshot.size > 0) {
        this.lastDoc = querySnapshot.docs[querySnapshot.docs.length - 1]

        for (const doc of querySnapshot.docs) {
          this.teasers.push({
            id: doc.id,
            ...doc.data()
          })
        }
      }

      this.isLoading = false
    }
  },
  head () {
    return {
      title: 'Home'
    }
  }
}
</script>
