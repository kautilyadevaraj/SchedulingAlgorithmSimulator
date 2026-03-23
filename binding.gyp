{
  'targets': [
    {
      'target_name': 'scheduling_algorithms',
      'sources': [
        'cpp/src/binding.cc',
        'cpp/src/FirstComeFirstServe.cpp',
        'cpp/src/RoundRobin.cpp',
        'cpp/src/ShortestJobFirst.cpp',
        'cpp/src/ShortestRemainingTimeFirst.cpp',
        'cpp/src/PriorityNonPreemptive.cpp',
        'cpp/src/PriorityPreemptive.cpp'
      ],
      'include_dirs': [
        'cpp/include',
        '<!(node -p "require(\'node-addon-api\').include_dir")'
      ],
      'conditions': [
        ['OS=="win"', {
          'msbuild_toolset': 'v143',
          'msbuild_settings': {
            'VCCLCompilerTool': {
              'RuntimeLibrary': '1'
            }
          }
        }],
        ['OS=="unix"', {
          'cflags': ['-Wall', '-Wextra', '-O2']
        }]
      ]
    }
  ]
}
