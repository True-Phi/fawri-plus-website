---
type: PageLayout
title: 'Contact Us '
sections:
  - type: GenericSection
    title:
      type: TitleBlock
      text: let's talk a little
      color: text-dark
    subtitle: Section with a form subtitle
    text: >+
      Have questions? Send us a message through our website, email us or give us
      a call. We’ll answer all your questions and would be happy to discuss all
      your options with Fawri+







      <i class="fa-solid fa-phone"></i> xdsds



      ✉️



    actions: []
    media:
      type: FormBlock
      fields:
        - type: TextFormControl
          name: name
          label: Name
          hideLabel: true
          placeholder: Your name
          isRequired: true
          width: full
        - type: TextFormControl
          name: Mobile Number
          label: Mobile Number
          hideLabel: true
          placeholder: Your mobile number
          isRequired: true
          width: full
        - type: EmailFormControl
          name: email
          label: Email
          hideLabel: true
          placeholder: Your email
          isRequired: true
          width: full
        - type: TextareaFormControl
          name: message
          label: Message
          hideLabel: true
          placeholder: Your message
          width: full
      submitButton:
        type: SubmitButtonFormControl
        label: Submit
        icon: arrowRight
        iconPosition: right
        style: primary
      elementId: contact-form
      styles:
        self:
          padding:
            - pt-6
            - pb-6
            - pl-6
            - pr-6
          borderColor: border-dark
          borderStyle: solid
          borderWidth: 1
          borderRadius: large
    badge:
      type: Badge
      label: Contact Us
      color: text-primary
    colors: bg-light-fg-dark
slug: contact
isDraft: false
---
